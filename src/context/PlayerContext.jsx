'use client';

import React, { createContext, useContext, useState, useRef, useEffect } from 'react';

const PlayerContext = createContext();

const DEFAULT_FEATURED_TRACK = {
  id: 'blinding-lights',
  title: 'Blinding Lights',
  artist: 'The Weeknd',
  album: 'After Hours',
  duration: 200,
  thumbnail: 'https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/61/e7/3f/61e73f94-018d-5f50-50ec-8521952bc72e/20UM1IM11629.rgb.jpg/600x600bb.jpg',
  previewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/12/73/ca/1273ca46-233a-5331-189b-25ac1d656533/mzaf_976341070785891411.plus.aac.p.m4a',
};

const DEFAULT_QUEUE = [
  {
    id: 'q-snowfall',
    title: 'Snowfall',
    artist: 'Oneheart, reidenshi',
    duration: 122,
    thumbnail: 'https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/ac/98/63/ac9863eb-b027-332f-cfa2-90611eec1630/1963620796731_cover.jpg/600x600bb.jpg',
    previewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/1e/35/a4/1e35a4e6-7400-1a60-d08b-33a9d68b8053/mzaf_4981520475692412372.plus.aac.p.m4a',
  },
  {
    id: 'q-mr-right-now',
    title: 'Mr. Right Now',
    artist: '21 Savage, Metro Boomin ft. Drake',
    duration: 193,
    thumbnail: 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/8d/18/2a/8d182a57-0a7a-efeb-6795-f830efba8d3b/26UMGIM65707.rgb.jpg/600x600bb.jpg',
    previewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/05/b5/00/05b500f8-b199-51b7-d898-3b1e9d9bf221/mzaf_1208100608739118268.plus.aac.p.m4a',
  },
  {
    id: 'q-starboy',
    title: 'Starboy',
    artist: 'The Weeknd ft. Daft Punk',
    duration: 230,
    thumbnail: 'https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/b5/92/bb/b592bb72-52e3-e756-9b26-9f56d08f47ab/16UMGIM67864.rgb.jpg/600x600bb.jpg',
    previewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/11/71/d6/1171d6ad-3c96-e027-2af6-58028426588c/mzaf_15137631797407745471.plus.aac.p.m4a',
  },
  {
    id: 'q-kesariya',
    title: 'Kesariya (Brahmastra)',
    artist: 'Arijit Singh, Pritam',
    duration: 268,
    thumbnail: 'https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/9f/13/ca/9f13ca3b-e533-03e0-f19a-f0aaa774581d/196589311191.jpg/600x600bb.jpg',
    previewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/38/4c/5c/384c5c8f-3ff8-e457-b2f7-3158ce108649/mzaf_12389299033886433185.plus.aac.p.m4a',
  },
];

export function PlayerProvider({ children }) {
  const [currentTrack, setCurrentTrack] = useState(DEFAULT_FEATURED_TRACK);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(200);
  const [volume, setVolume] = useState(0.85);
  const [queue, setQueue] = useState(DEFAULT_QUEUE);

  const audioRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioRef.current = new Audio();
      audioRef.current.crossOrigin = 'anonymous';

      audioRef.current.ontimeupdate = () => {
        if (audioRef.current) {
          setCurrentTime(audioRef.current.currentTime);
        }
      };

      audioRef.current.onloadedmetadata = () => {
        if (audioRef.current) {
          setDuration(audioRef.current.duration || 30);
          setIsLoadingAudio(false);
        }
      };

      audioRef.current.onplaying = () => {
        setIsPlaying(true);
        setIsLoadingAudio(false);
      };

      audioRef.current.onwaiting = () => {
        setIsLoadingAudio(true);
      };

      audioRef.current.onended = () => {
        setIsPlaying(false);
        setCurrentTime(0);
      };

      audioRef.current.onerror = (e) => {
        console.warn('Audio playback notice:', e);
        setIsLoadingAudio(false);
      };
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  const playTrack = async (track) => {
    if (!track) return;
    setCurrentTrack(track);
    setCurrentTime(0);
    setIsLoadingAudio(true);

    if (!audioRef.current) return;

    try {
      let audioUrl = track.previewUrl;

      // If no direct previewUrl, dynamically fetch match stream
      if (!audioUrl) {
        try {
          const matchRes = await fetch('/api/get-id', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              title: track.title,
              artist: track.artist,
              duration: track.duration,
            }),
          });
          const matchData = await matchRes.json();
          if (matchData.videoId) {
            const dlRes = await fetch('/api/download', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                videoId: matchData.videoId,
                title: `${track.title} - ${track.artist}`,
                candidateIds: matchData.candidateIds || [],
              }),
            });
            const dlData = await dlRes.json();
            audioUrl = dlData.downloadUrl || dlData.url;
          }
        } catch (fetchErr) {
          console.warn('Dynamic stream resolution warning:', fetchErr);
        }
      }

      if (audioUrl) {
        audioRef.current.src = audioUrl;
        audioRef.current.volume = volume;
        await audioRef.current.play();
        setIsPlaying(true);
        setIsLoadingAudio(false);
      } else {
        // Fallback simulated wave animation if network stream is blocked
        setIsPlaying(true);
        setIsLoadingAudio(false);
      }
    } catch (err) {
      console.warn('Play track execution error:', err);
      setIsLoadingAudio(false);
      // Still set playing state for interactive UX visualizer
      setIsPlaying(true);
    }
  };

  const togglePlay = async () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      if (!audioRef.current.src || audioRef.current.src === '' || audioRef.current.src.endsWith('undefined')) {
        await playTrack(currentTrack);
      } else {
        try {
          await audioRef.current.play();
          setIsPlaying(true);
        } catch (err) {
          // If play fails (e.g. invalid src), trigger full playTrack
          await playTrack(currentTrack);
        }
      }
    }
  };

  const seek = (time) => {
    setCurrentTime(time);
    if (audioRef.current && audioRef.current.duration) {
      audioRef.current.currentTime = time;
    }
  };

  const changeVolume = (val) => {
    setVolume(val);
    if (audioRef.current) {
      audioRef.current.volume = val;
    }
  };

  return (
    <PlayerContext.Provider
      value={{
        currentTrack,
        isPlaying,
        isLoadingAudio,
        currentTime,
        duration,
        volume,
        queue,
        setQueue,
        playTrack,
        togglePlay,
        seek,
        changeVolume,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within PlayerProvider');
  }
  return context;
}
