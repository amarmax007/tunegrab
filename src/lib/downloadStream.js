import axios from 'axios';

/**
 * Resolves a direct high-quality MP3 download URL from videoId or song title
 */
export async function getDownloadUrl(videoId, title = '', candidateIds = []) {
  // Method 1: SpotSaver / Yt1s audio tunnel conversion
  try {
    const res = await axios.post('https://spotsaver.net/api/download/', {
      videoId,
      candidateIds: candidateIds || [],
      format: 'mp3',
      title: title
    }, {
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'
      },
      timeout: 10000
    });

    if (res.data?.success && (res.data?.downloadUrl || res.data?.url || res.data?.mediaUrl)) {
      return {
        success: true,
        downloadUrl: res.data.downloadUrl || res.data.url || res.data.mediaUrl,
        filename: res.data.filename || `${title}.mp3`,
        duration: res.data.duration || 0,
        bitrate: '320kbps'
      };
    }
  } catch (err) {
    console.warn('SpotSaver download converter fallback triggered:', err.message);
  }

  // Method 2: Cobalt API (High Quality Audio Converter)
  const cobaltInstances = [
    'https://api.cobalt.tools/api/json',
    'https://cobalt-api.kwiatekm.tokyo/api/json',
    'https://api.wuk.sh/api/json'
  ];

  for (const instance of cobaltInstances) {
    try {
      const cobRes = await axios.post(instance, {
        url: `https://www.youtube.com/watch?v=${videoId}`,
        downloadMode: 'audio',
        audioFormat: 'mp3',
        audioBitrate: '320'
      }, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        timeout: 8000
      });

      if (cobRes.data?.url) {
        return {
          success: true,
          downloadUrl: cobRes.data.url,
          filename: `${title}.mp3`,
          duration: 0,
          bitrate: '320kbps'
        };
      }
    } catch (e) {
      // Try next
    }
  }

  // Method 3: Loader.to / Ymp3 fallback API
  try {
    const loaderRes = await axios.get(`https://loader.to/ajax/download.php?button=1&start=1&end=1&format=mp3&url=${encodeURIComponent(`https://www.youtube.com/watch?v=${videoId}`)}`, {
      timeout: 8000
    });
    if (loaderRes.data?.id) {
      const progressId = loaderRes.data.id;
      // Poll once or return progress
      for (let i = 0; i < 5; i++) {
        await new Promise(r => setTimeout(r, 1200));
        const checkRes = await axios.get(`https://loader.to/ajax/progress.php?id=${progressId}`);
        if (checkRes.data?.download_url) {
          return {
            success: true,
            downloadUrl: checkRes.data.download_url,
            filename: `${title}.mp3`,
            duration: 0,
            bitrate: '320kbps'
          };
        }
      }
    }
  } catch (loaderErr) {
    console.warn('Loader API error:', loaderErr.message);
  }

  throw new Error('Unable to convert song to MP3 at this moment. Please try again.');
}
