import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { CallData, CallRole, CallStatus, CallType } from "../../lib/types";
import {
  appendCallCandidates,
  createCallDoc,
  deleteCallDoc,
  markCallConnected,
  subscribeCallDoc,
  transitionCallStatus,
  updateCallDoc,
} from "./signaling";
import { startRingtone } from "./ringtone";
import {
  CLEANUP_DELAY_MS,
  ICE_SERVERS,
  MISSED_CALL_TIMEOUT_MS,
  RECONNECT_GRACE_MS,
  RESTART_DELAY_MS,
  VIDEO_CONSTRAINTS,
} from "./constants";
import { describeSignalingError } from "./errors";

export interface UseCallOptions {
  callId: string;
  currentUserId: string;
  peerId: string;
  type: CallType;
  role: CallRole;
  autoAccept?: boolean;
  onTerminal?: (status: CallStatus, message?: string) => void;
}

export interface UseCallResult {
  status: CallStatus;
  call: CallData | null;
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  isMuted: boolean;
  isCameraOff: boolean;
  isFullscreen: boolean;
  usingFrontCamera: boolean;
  canSwitchCamera: boolean;
  degradedToAudio: boolean;
  connectionState: RTCPeerConnectionState | null;
  error: string | null;
  elapsedSeconds: number;
  toggleMute: () => void;
  toggleCamera: () => void;
  toggleFullscreen: () => void;
  switchCamera: () => Promise<void>;
  endCall: (reason?: CallStatus) => void;
}

export function useCall(options: UseCallOptions): UseCallResult {
  const { callId, currentUserId, peerId, type, role, autoAccept, onTerminal } = options;

  const [call, setCall] = useState<CallData | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [usingFrontCamera, setUsingFrontCamera] = useState(true);
  const [canSwitchCamera, setCanSwitchCamera] = useState(false);
  const [degradedToAudio, setDegradedToAudio] = useState(false);
  const degradedToAudioRef = useRef(false);
  const [connectionState, setConnectionState] = useState<RTCPeerConnectionState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const peerRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const callRef = useRef<CallData | null>(null);
  const mutedRef = useRef(false);
  const cameraOffRef = useRef(false);
  const frontRef = useRef(true);
  const remoteDescSetRef = useRef(false);
  const acceptedRef = useRef(false);
  const pendingAcceptRef = useRef(false);
  const initStartedRef = useRef(false);
  const docCreatedRef = useRef(false);
  const pendingCandidatesRef = useRef<RTCIceCandidateInit[]>([]);
  const bufferedCandidatesRef = useRef<RTCIceCandidateInit[]>([]);
  const processedCandidatesRef = useRef({ caller: 0, callee: 0 });
  const missedTimerRef = useRef<number | null>(null);
  const reconnectTimerRef = useRef<number | null>(null);
  const endGraceTimerRef = useRef<number | null>(null);
  const cleanupTimeoutRef = useRef<number | null>(null);
  const unsubRef = useRef<(() => void) | null>(null);
  const stopRingtoneRef = useRef<(() => void) | null>(null);
  const cleanupScheduledRef = useRef(false);
  const endedRef = useRef(false);
  const callIdRef = useRef(callId);
  const stateRef = useRef({ cancelled: false });
  const lastOfferRoundRef = useRef(0);
  const lastAnswerRoundRef = useRef(0);
  const restartingRef = useRef(false);

  function clearTimers() {
    if (missedTimerRef.current !== null) {
      window.clearTimeout(missedTimerRef.current);
      missedTimerRef.current = null;
    }
    if (reconnectTimerRef.current !== null) {
      window.clearTimeout(reconnectTimerRef.current);
      reconnectTimerRef.current = null;
    }
    if (endGraceTimerRef.current !== null) {
      window.clearTimeout(endGraceTimerRef.current);
      endGraceTimerRef.current = null;
    }
  }

  function disposePeer() {
    try {
      peerRef.current?.close();
    } catch {
      // Peer connection already closed.
    }
    peerRef.current = null;
  }

  function stopLocalMedia() {
    localStreamRef.current?.getTracks().forEach(track => track.stop());
    localStreamRef.current = null;
    setLocalStream(null);
  }

  function disposeAll() {
    stopRingtoneRef.current?.();
    stopRingtoneRef.current = null;
    clearTimers();
    unsubRef.current?.();
    unsubRef.current = null;
    disposePeer();
    stopLocalMedia();
  }

  function scheduleCleanup(delay = CLEANUP_DELAY_MS) {
    if (cleanupScheduledRef.current) return;
    cleanupScheduledRef.current = true;
    stopRingtoneRef.current?.();
    stopRingtoneRef.current = null;
    clearTimers();
    stopLocalMedia();
    cleanupTimeoutRef.current = window.setTimeout(() => {
      void deleteCallDoc(callIdRef.current);
      disposePeer();
      unsubRef.current?.();
      unsubRef.current = null;
    }, delay);
  }

  function notifyTerminal(status: CallStatus, message?: string) {
    if (endedRef.current) return;
    endedRef.current = true;
    scheduleCleanup();
    onTerminal?.(status, message);
  }

  function handleDocListenerError(err: unknown) {
    if (endedRef.current) return;
    const mediaConnected = peerRef.current?.connectionState === "connected";
    console.error(
      "[calls] doc listener error:",
      callIdRef.current,
      mediaConnected ? "(media connected - ignoring to keep the call alive)" : "",
      err
    );
    if (mediaConnected) return;
    const message = describeSignalingError(err, "call document");
    setError(message);
    notifyTerminal("failed", message);
  }

  function describeMediaError(cause: unknown): string {
    if (cause instanceof DOMException) {
      if (cause.name === "NotAllowedError" || cause.name === "PermissionDeniedError") {
        return "Microphone or camera permission was denied. Allow access and try again.";
      }
      if (cause.name === "NotFoundError" || cause.name === "DevicesNotFoundError") {
        return "No microphone or camera device was found on this device.";
      }
      if (cause.name === "NotReadableError") {
        return "The camera or microphone is in use by another application.";
      }
      if (cause.name === "OverconstrainedError") {
        return "The camera could not satisfy the requested settings.";
      }
    }
    if (cause instanceof Error) {
      if (cause.message && cause.message.toLowerCase().includes("getusermedia")) {
        return "Camera and microphone access is unavailable in this browser.";
      }
      return cause.message;
    }
    return "Could not access the camera or microphone.";
  }

  function handleMediaError(cause: unknown) {
    const message = describeMediaError(cause);
    setError(message);
    if (endedRef.current) return;
    if (docCreatedRef.current) {
      void updateCallDoc(callIdRef.current, {
        status: "failed",
        endedAt: Date.now(),
        endedBy: currentUserId,
      }).catch(() => {});
    }
    notifyTerminal("failed", message);
  }

  async function acquireMedia(wantVideo: boolean): Promise<MediaStream> {
    if (!navigator.mediaDevices?.getUserMedia) {
      throw new Error("Camera and microphone access is unavailable in this browser.");
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia(
        wantVideo
          ? { audio: true, video: VIDEO_CONSTRAINTS }
          : { audio: true, video: false }
      );
      if (wantVideo && !stream.getVideoTracks().some(track => track.kind === "video")) {
        degradedToAudioRef.current = true;
        setDegradedToAudio(true);
      }
      monitorStream(stream, "caller/callee");
      return stream;
    } catch (cause) {
      if (!wantVideo) throw cause;
      const name = cause instanceof DOMException ? cause.name : "";
      const recoverable = [
        "NotFoundError",
        "DevicesNotFoundError",
        "NotReadableError",
        "OverconstrainedError",
        "AbortError",
      ].includes(name);
      if (!recoverable) throw cause;
      const audio = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      degradedToAudioRef.current = true;
      setDegradedToAudio(true);
      monitorStream(audio, "audio-only fallback");
      return audio;
    }
  }

  function addStreamTracks(stream: MediaStream) {
    for (const track of stream.getTracks()) {
      peerRef.current?.addTrack(track, stream);
    }
  }

  function monitorStream(stream: MediaStream, label: string) {
    for (const track of stream.getTracks()) {
      console.log("[calls] local track:", label, track.kind, "readyState:", track.readyState);
      track.addEventListener("ended", () => {
        console.error("[calls] local track ENDED:", label, track.kind);
      });
      track.addEventListener("mute", () => {
        console.warn("[calls] local track muted:", label, track.kind);
      });
      track.addEventListener("unmute", () => {
        console.warn("[calls] local track unmuted:", label, track.kind);
      });
    }
  }

  function createPeer(): RTCPeerConnection {
    const peer = new RTCPeerConnection(ICE_SERVERS);
    peerRef.current = peer;

    peer.onicecandidate = (event: RTCPeerConnectionIceEvent) => {
      const candidate = event.candidate;
      if (!candidate) return;
      const init = candidate.toJSON();
      console.debug("[calls] local ICE candidate:", role, init.candidate);
      if (!docCreatedRef.current) {
        pendingCandidatesRef.current.push(init);
        return;
      }
      void appendCallCandidates(
        callIdRef.current,
        role === "caller" ? "callerCandidates" : "calleeCandidates",
        [init]
      ).catch(() => {});
    };

    peer.onicecandidateerror = (event: RTCPeerConnectionIceErrorEvent) => {
      console.error("[calls] ICE candidate error:", event.errorCode, event.url || event.errorText);
    };

    peer.oniceconnectionstatechange = () => {
      console.log("[calls] iceConnectionState:", role, peer.iceConnectionState);
    };

    peer.ontrack = (event: RTCTrackEvent) => {
      console.log("[calls] remote track:", role, event.track.kind, "readyState:", event.track.readyState);
      const stream = event.streams[0] ?? new MediaStream([event.track]);
      setRemoteStream(stream);
    };

    peer.onconnectionstatechange = () => {
      console.log("[calls] connectionState:", role, peer.connectionState);
      setConnectionState(peer.connectionState);
      if (peer.connectionState === "connected") {
        if (reconnectTimerRef.current !== null) {
          window.clearTimeout(reconnectTimerRef.current);
          reconnectTimerRef.current = null;
        }
        if (endGraceTimerRef.current !== null) {
          window.clearTimeout(endGraceTimerRef.current);
          endGraceTimerRef.current = null;
        }
        void peer
          .getStats()
          .then(stats => {
            stats.forEach(report => {
              const pair = report as RTCStats & {
                state?: string;
                localCandidateId?: string;
                remoteCandidateId?: string;
              };
              if (report.type === "candidate-pair" && pair.state === "succeeded") {
                const local = stats.get(pair.localCandidateId ?? "") as
                  | (RTCStats & { candidateType?: string; address?: string })
                  | undefined;
                const remote = stats.get(pair.remoteCandidateId ?? "") as
                  | (RTCStats & { candidateType?: string; address?: string })
                  | undefined;
                console.log(
                  "[calls] selected candidate pair:",
                  role,
                  "local:",
                  local?.candidateType,
                  local?.address,
                  "remote:",
                  remote?.candidateType,
                  remote?.address
                );
              }
            });
          })
          .catch(() => {});
        void markCallConnected(callIdRef.current);
      } else if (peer.connectionState === "disconnected") {
        if (reconnectTimerRef.current === null && !endedRef.current) {
          console.log("[calls] disconnected, scheduling recovery:", role);
          reconnectTimerRef.current = window.setTimeout(() => {
            reconnectTimerRef.current = null;
            if (endedRef.current) return;
            if (peerRef.current?.connectionState === "connected") return;
            if (role === "caller") {
              void restartIce();
            }
            if (endGraceTimerRef.current === null) {
              console.log("[calls] end grace timer started:", role);
              endGraceTimerRef.current = window.setTimeout(() => {
                endGraceTimerRef.current = null;
                if (
                  !endedRef.current &&
                  peerRef.current?.connectionState !== "connected"
                ) {
                  const message = "The call was disconnected.";
                  setError(message);
                  notifyTerminal("failed", message);
                }
              }, RECONNECT_GRACE_MS);
            }
          }, RESTART_DELAY_MS);
        }
      } else if (peer.connectionState === "failed") {
        if (!endedRef.current) {
          const message = "Connection failed. The call has been disconnected.";
          setError(message);
          notifyTerminal("failed", message);
        }
      }
    };

    return peer;
  }

  function flushBufferedCandidates() {
    if (!remoteDescSetRef.current) return;
    const peer = peerRef.current;
    if (!peer) return;
    const buffer = bufferedCandidatesRef.current;
    bufferedCandidatesRef.current = [];
    for (const candidate of buffer) {
      void peer.addIceCandidate(new RTCIceCandidate(candidate)).catch(() => {});
    }
  }

  async function setRemoteDescription(description: RTCSessionDescriptionInit) {
    const peer = peerRef.current;
    if (!peer) return;
    await peer.setRemoteDescription(description);
    remoteDescSetRef.current = true;
    flushBufferedCandidates();
  }

  async function restartIce() {
    const peer = peerRef.current;
    if (!peer || endedRef.current || restartingRef.current) return;
    restartingRef.current = true;
    try {
      const nextRound = (callRef.current?.offerRound ?? 0) + 1;
      const offer = await peer.createOffer({ iceRestart: true });
      if (endedRef.current) return;
      await peer.setLocalDescription(offer);
      if (endedRef.current) return;
      await updateCallDoc(callIdRef.current, {
        offer: peer.localDescription?.toJSON() ?? null,
        offerRound: nextRound,
      }).catch(() => {});
      console.log("[calls] ICE restart offer sent:", role, "round:", nextRound);
    } catch (cause) {
      console.error("[calls] ICE restart failed:", cause);
    } finally {
      restartingRef.current = false;
    }
  }

  async function reAnswer(offer: RTCSessionDescriptionInit) {
    const peer = peerRef.current;
    if (!peer || endedRef.current) return;
    try {
      await peer.setRemoteDescription(offer);
      if (endedRef.current) return;
      const answer = await peer.createAnswer();
      if (endedRef.current) return;
      await peer.setLocalDescription(answer);
      await updateCallDoc(callIdRef.current, {
        answer: peer.localDescription?.toJSON() ?? null,
        answerRound: lastOfferRoundRef.current,
      }).catch(() => {});
      console.log("[calls] renegotiation answered:", role, "round:", lastOfferRoundRef.current);
    } catch (cause) {
      console.error("[calls] renegotiation answer failed:", cause);
    }
  }

  function drainCandidates(data: CallData) {
    const candidates =
      role === "caller" ? data.calleeCandidates ?? [] : data.callerCandidates ?? [];
    const key = role === "caller" ? "callee" : "caller";
    const processed = processedCandidatesRef.current;
    for (let index = processed[key]; index < candidates.length; index++) {
      const candidate = candidates[index];
      if (remoteDescSetRef.current) {
        void peerRef.current?.addIceCandidate(new RTCIceCandidate(candidate)).catch(() => {});
      } else {
        bufferedCandidatesRef.current.push(candidate);
      }
      processed[key] = index + 1;
    }
  }

  function startMissedTimer() {
    if (missedTimerRef.current !== null) return;
    missedTimerRef.current = window.setTimeout(() => {
      missedTimerRef.current = null;
      if (callRef.current?.status === "ringing") {
        void transitionCallStatus(callIdRef.current, "ringing", "missed").then(ok => {
          if (ok) notifyTerminal("missed");
        });
      }
    }, MISSED_CALL_TIMEOUT_MS);
  }

  function handleDoc(data: CallData | null) {
    if (endedRef.current) return;
    if (!data) {
      callRef.current = null;
      setCall(null);
      notifyTerminal("ended");
      return;
    }

    callRef.current = data;
    setCall(data);

    const terminal: Exclude<CallStatus, "incoming">[] = [
      "ended",
      "declined",
      "missed",
      "cancelled",
      "busy",
      "failed",
    ];
    if (terminal.includes(data.status)) {
      notifyTerminal(data.status);
      return;
    }

    if (role === "callee" && pendingAcceptRef.current && data.offer) {
      pendingAcceptRef.current = false;
      void runCalleeAccept(data.offer);
    }

    const answerRound = data.answerRound ?? 0;
    if (
      role === "caller" &&
      data.answer &&
      (!remoteDescSetRef.current || answerRound > lastAnswerRoundRef.current)
    ) {
      lastAnswerRoundRef.current = answerRound;
      void setRemoteDescription(data.answer).catch(() => {
        setError("Could not establish a connection.");
        notifyTerminal("failed");
      });
    }

    const offerRound = data.offerRound ?? 0;
    if (
      role === "callee" &&
      acceptedRef.current &&
      data.offer &&
      offerRound > lastOfferRoundRef.current
    ) {
      lastOfferRoundRef.current = offerRound;
      void reAnswer(data.offer);
    }

    if (data.offer || data.answer || remoteDescSetRef.current) {
      drainCandidates(data);
    }
  }

  async function runCalleeAccept(offer: RTCSessionDescriptionInit) {
    if (endedRef.current || stateRef.current.cancelled) return;
    try {
      const stream = await acquireMedia(type === "video");
      if (endedRef.current || stateRef.current.cancelled) {
        stream.getTracks().forEach(track => track.stop());
        return;
      }
      localStreamRef.current = stream;
      setLocalStream(stream);
      createPeer();
      addStreamTracks(stream);
      await setRemoteDescription(offer);
      if (callRef.current) drainCandidates(callRef.current);
      const peer = peerRef.current;
      if (!peer) return;
      const answer = await peer.createAnswer();
      if (endedRef.current || stateRef.current.cancelled) return;
      await peer.setLocalDescription(answer);
      const accepted = await transitionCallStatus(callIdRef.current, "ringing", "connecting");
      if (!accepted) {
        if (!endedRef.current) notifyTerminal("ended");
        return;
      }
      acceptedRef.current = true;
      await updateCallDoc(callIdRef.current, {
        answer: peer.localDescription?.toJSON() ?? null,
      }).catch(() => {});
    } catch (cause) {
      handleMediaError(cause);
    }
  }

  async function initCaller() {
    if (initStartedRef.current) return;
    initStartedRef.current = true;
    try {
      const stream = await acquireMedia(type === "video");
      if (stateRef.current.cancelled || endedRef.current) {
        stream.getTracks().forEach(track => track.stop());
        return;
      }
      localStreamRef.current = stream;
      setLocalStream(stream);
      createPeer();
      addStreamTracks(stream);
      const peer = peerRef.current;
      if (!peer) return;
      const offer = await peer.createOffer();
      if (stateRef.current.cancelled || endedRef.current) return;
      await peer.setLocalDescription(offer);
      if (stateRef.current.cancelled || endedRef.current) return;
      const offerJson = peer.localDescription?.toJSON() ?? null;
      await createCallDoc(callIdRef.current, {
        callerId: currentUserId,
        calleeId: peerId,
        type,
        status: "ringing",
        createdAt: Date.now(),
        offer: offerJson,
        callerCandidates: [],
        calleeCandidates: [],
      });
      if (stateRef.current.cancelled || endedRef.current) {
        void deleteCallDoc(callIdRef.current);
        return;
      }
      docCreatedRef.current = true;
      if (pendingCandidatesRef.current.length > 0) {
        const pending = pendingCandidatesRef.current;
        pendingCandidatesRef.current = [];
        void appendCallCandidates(callIdRef.current, "callerCandidates", pending).catch(() => {});
      }
      unsubRef.current = subscribeCallDoc(callIdRef.current, handleDoc, handleDocListenerError);
      startMissedTimer();
    } catch (cause) {
      handleMediaError(cause);
    }
  }

  async function initCallee() {
    if (initStartedRef.current) return;
    initStartedRef.current = true;
    pendingAcceptRef.current = autoAccept ?? false;
    unsubRef.current = subscribeCallDoc(callIdRef.current, handleDoc, handleDocListenerError);
  }

  useEffect(() => {
    stateRef.current.cancelled = false;
    if (role === "caller") {
      void initCaller();
    } else {
      void initCallee();
    }
    return () => {
      stateRef.current.cancelled = true;
      disposeAll();
      initStartedRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const status: CallStatus = useMemo(() => {
    if (error) return "failed";
    if (!call) return role === "caller" ? "ringing" : "incoming";
    if (role === "callee" && call.status === "ringing" && !acceptedRef.current) return "incoming";
    return call.status;
  }, [call, error, role]);

  useEffect(() => {
    if (status === "ringing" || status === "incoming") {
      stopRingtoneRef.current?.();
      stopRingtoneRef.current = startRingtone();
    } else {
      stopRingtoneRef.current?.();
      stopRingtoneRef.current = null;
    }
    return () => {
      stopRingtoneRef.current?.();
      stopRingtoneRef.current = null;
    };
  }, [status]);

  useEffect(() => {
    if (status !== "connected") {
      setElapsedSeconds(0);
      return;
    }
    const startedAt = Date.now();
    const interval = window.setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - startedAt) / 1000));
    }, 1000);
    return () => window.clearInterval(interval);
  }, [status]);

  useEffect(() => {
    if (type !== "video") return;
    let active = true;
    const detect = async () => {
      try {
        if (!navigator.mediaDevices?.enumerateDevices) return;
        const devices = await navigator.mediaDevices.enumerateDevices();
        if (!active) return;
        setCanSwitchCamera(devices.filter(device => device.kind === "videoinput").length > 1);
      } catch {
        // Device enumeration is unavailable (e.g. insecure context).
      }
    };
    void detect();
    return () => {
      active = false;
    };
  }, [type]);

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  const toggleMute = useCallback(() => {
    const next = !mutedRef.current;
    mutedRef.current = next;
    localStreamRef.current?.getAudioTracks().forEach(track => {
      track.enabled = !next;
    });
    setIsMuted(next);
  }, []);

  const toggleCamera = useCallback(() => {
    const next = !cameraOffRef.current;
    cameraOffRef.current = next;
    localStreamRef.current?.getVideoTracks().forEach(track => {
      track.enabled = !next;
    });
    setIsCameraOff(next);
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (document.fullscreenElement) {
      void document.exitFullscreen().catch(() => {});
    } else {
      void document.documentElement.requestFullscreen().catch(() => {});
    }
  }, []);

  const switchCamera = useCallback(async () => {
    if (type !== "video" || !navigator.mediaDevices?.getUserMedia) return;
    const nextFacing = frontRef.current ? "environment" : "user";
    try {
      const fresh = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: nextFacing, width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      const videoTrack = fresh.getVideoTracks()[0];
      if (!videoTrack) {
        fresh.getTracks().forEach(track => track.stop());
        return;
      }
      const sender = peerRef.current?.getSenders().find(s => s.track?.kind === "video");
      await sender?.replaceTrack(videoTrack);
      const currentStream = localStreamRef.current;
      if (currentStream) {
        const oldVideoTrack = currentStream.getVideoTracks()[0];
        if (oldVideoTrack) {
          currentStream.removeTrack(oldVideoTrack);
          oldVideoTrack.stop();
        }
        videoTrack.enabled = !cameraOffRef.current;
        currentStream.addTrack(videoTrack);
      }
      fresh.getAudioTracks().forEach(track => track.stop());
      frontRef.current = !frontRef.current;
      setUsingFrontCamera(frontRef.current);
    } catch {
      // Switching failed; keep the current camera.
    }
  }, [type]);

  const endCall = useCallback(
    (reason: CallStatus = "ended") => {
      if (endedRef.current) return;
      const effective: Exclude<CallStatus, "incoming"> =
        role === "caller" && (callRef.current?.status === "ringing" || !callRef.current)
          ? "cancelled"
          : reason === "incoming"
            ? "ended"
            : reason;
      endedRef.current = true;
      if (callRef.current || docCreatedRef.current) {
        void updateCallDoc(callIdRef.current, {
          status: effective,
          endedAt: Date.now(),
          endedBy: currentUserId,
        }).catch(() => {});
      }
      scheduleCleanup();
      onTerminal?.(effective);
    },
    [role, currentUserId, onTerminal]
  );

  return {
    status,
    call,
    localStream,
    remoteStream,
    isMuted,
    isCameraOff,
    isFullscreen,
    usingFrontCamera,
    canSwitchCamera,
    degradedToAudio,
    connectionState,
    error,
    elapsedSeconds,
    toggleMute,
    toggleCamera,
    toggleFullscreen,
    switchCamera,
    endCall,
  };
}
