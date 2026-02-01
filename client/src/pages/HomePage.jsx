import { useEffect, useRef, useState } from "react";
import axios from "axios";
import TrendingCard from "../components/TrendingCard";
import toast from "react-hot-toast";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, FreeMode } from "swiper/modules";
import "swiper/css";

const EDGE_BUFFER = 0.03;

const HomePage = () => {
  const [moviesTrending, setMoviesTrending] = useState([]);
  const [tvTrending, setTvTrending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const swiperRef = useRef(null);
  const tickerWrapRef = useRef(null);

  const isHoveredRef = useRef(false);

  const pausedTranslateRef = useRef(0);

  const lastTranslateRef = useRef(null);
  const stallCountRef = useRef(0);

  const scrubBarRef = useRef(null);
  const isScrubbingRef = useRef(false);
  const [scrubProgress, setScrubProgress] = useState(0);

  const tvSwiperRef = useRef(null);

  const tvTickerWrapRef = useRef(null);

  const tvIsHoveredRef = useRef(false);

  const tvPausedTranslateRef = useRef(0);

  const tvLastTranslateRef = useRef(null);

  const tvStallCountRef = useRef(0);

  const tvScrubBarRef = useRef(null);

  const tvIsScrubbingRef = useRef(false);

  const [tvScrubProgress, setTvScrubProgress] = useState(0);

  // Fetch trending
  useEffect(() => {
    const tvAPI = "http://localhost:5050/api/v1/tv/trending";
    const moviesAPI = "http://localhost:5050/api/v1/movies/trending";

    const fetchTrending = async () => {
      try {
        setLoading(true);
        setError("");

        const [tvRes, movieRes] = await Promise.all([
          axios.get(tvAPI, { withCredentials: true }),
          axios.get(moviesAPI, { withCredentials: true }),
        ]);

        setTvTrending(tvRes.data?.results || []);
        setMoviesTrending(movieRes.data?.results || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load trending");
      } finally {
        setLoading(false);
      }
    };

    fetchTrending();
  }, []);

  // Hard restart ticker
  const hardRestartTicker = () => {
    const swiper = swiperRef.current;
    if (!swiper) return;

    try {
      swiper.update();

      if (swiper.loopDestroy) swiper.loopDestroy();
      if (swiper.loopCreate) swiper.loopCreate();

      swiper.autoplay?.stop();
      if (!isHoveredRef.current && !isScrubbingRef.current) {
        swiper.autoplay?.start();
      }
    } catch (e) {
      console.warn("hardRestartTicker error:", e);
    }
  };

  const hardRestartTvTicker = () => {
    const swiper = tvSwiperRef.current;
    if (!swiper) return;

    try {
      swiper.update();

      if (swiper.loopDestroy) swiper.loopDestroy();
      if (swiper.loopCreate) swiper.loopCreate();

      swiper.autoplay?.stop();
      if (!tvIsHoveredRef.current && !tvIsScrubbingRef.current) {
        swiper.autoplay?.start();
      }
    } catch (e) {
      console.warn("hardRestartTvTicker error:", e);
    }
  };

  // Restart when movies load/changes
  useEffect(() => {
    if (!moviesTrending.length || !swiperRef.current) return;

    requestAnimationFrame(() => {
      hardRestartTicker();
      setTimeout(hardRestartTicker, 50);
    });
  }, [moviesTrending]);

  // Restart when TV loads/changes
  useEffect(() => {
    if (!tvTrending.length || !tvSwiperRef.current) return;

    requestAnimationFrame(() => {
      hardRestartTvTicker();
      setTimeout(hardRestartTvTicker, 50);
    });
  }, [tvTrending]);

  // Pause
  const pauseNow = () => {
    const swiper = swiperRef.current;
    if (!swiper) return;

    isHoveredRef.current = true;

    swiper.autoplay?.stop();

    const t = swiper.getTranslate();
    pausedTranslateRef.current = t;

    swiper.setTransition(0);
    swiper.setTranslate(t);

    if (swiper.wrapperEl) {
      swiper.wrapperEl.style.transitionDuration = "0ms";
    }
  };

  // TV Pause
  const pauseTvNow = () => {
    const swiper = tvSwiperRef.current;
    if (!swiper) return;

    tvIsHoveredRef.current = true;

    swiper.autoplay?.stop();

    const t = swiper.getTranslate();
    tvPausedTranslateRef.current = t;

    swiper.setTransition(0);
    swiper.setTranslate(t);

    if (swiper.wrapperEl) {
      swiper.wrapperEl.style.transitionDuration = "0ms";
    }
  };

  // TV Resume
  const resumeTvNow = () => {
    const swiper = tvSwiperRef.current;
    if (!swiper) return;

    tvIsHoveredRef.current = false;
    if (tvIsScrubbingRef.current) return;

    if (swiper.wrapperEl) {
      swiper.wrapperEl.style.transitionDuration = "";
    }

    try {
      swiper.update();
      if (swiper.loopDestroy) swiper.loopDestroy();
      if (swiper.loopCreate) swiper.loopCreate();
    } catch {}

    const saved = tvPausedTranslateRef.current;
    swiper.setTransition(0);
    swiper.setTranslate(saved);

    requestAnimationFrame(() => {
      if (tvIsHoveredRef.current || tvIsScrubbingRef.current) return;
      swiper.autoplay?.stop();
      swiper.autoplay?.start();
    });
  };

  // Resume
  const resumeNow = () => {
    const swiper = swiperRef.current;
    if (!swiper) return;

    isHoveredRef.current = false;
    if (isScrubbingRef.current) return;

    if (swiper.wrapperEl) {
      swiper.wrapperEl.style.transitionDuration = "";
    }

    try {
      swiper.update();
      if (swiper.loopDestroy) swiper.loopDestroy();
      if (swiper.loopCreate) swiper.loopCreate();
    } catch {}

    const saved = pausedTranslateRef.current;
    swiper.setTransition(0);
    swiper.setTranslate(saved);

    requestAnimationFrame(() => {
      if (isHoveredRef.current || isScrubbingRef.current) return;
      swiper.autoplay?.stop();
      swiper.autoplay?.start();
    });
  };

  // Hover listeners
  useEffect(() => {
    const wrap = tickerWrapRef.current;
    if (!wrap) return;

    wrap.addEventListener("pointerenter", pauseNow);
    wrap.addEventListener("pointerleave", resumeNow);

    return () => {
      wrap.removeEventListener("pointerenter", pauseNow);
      wrap.removeEventListener("pointerleave", resumeNow);
    };
  }, []);

  // TV Hover listeners
  useEffect(() => {
    const wrap = tvTickerWrapRef.current;
    if (!wrap) return;

    wrap.addEventListener("pointerenter", pauseTvNow);
    wrap.addEventListener("pointerleave", resumeTvNow);

    return () => {
      wrap.removeEventListener("pointerenter", pauseTvNow);
      wrap.removeEventListener("pointerleave", resumeTvNow);
    };
  }, []);

  // Watchdog
  useEffect(() => {
    const id = setInterval(() => {
      const swiper = swiperRef.current;
      if (!swiper || isHoveredRef.current || isScrubbingRef.current) return;
      if (!moviesTrending.length) return;

      const t = swiper.getTranslate();

      if (lastTranslateRef.current === null) {
        lastTranslateRef.current = t;
        return;
      }

      const same = Math.abs(t - lastTranslateRef.current) < 0.01;
      lastTranslateRef.current = t;

      if (same) stallCountRef.current += 1;
      else stallCountRef.current = 0;

      const stalledTooLong = stallCountRef.current >= 2;
      const notRunning = swiper.autoplay && swiper.autoplay.running === false;

      if (stalledTooLong || notRunning) {
        stallCountRef.current = 0;
        swiper.autoplay?.stop();
        swiper.autoplay?.start();
      }
    }, 1000);

    return () => clearInterval(id);
  }, [moviesTrending]);

  // TV Watchdog
  useEffect(() => {
    const id = setInterval(() => {
      const swiper = tvSwiperRef.current;
      if (!swiper || tvIsHoveredRef.current || tvIsScrubbingRef.current) return;
      if (!tvTrending.length) return;

      const t = swiper.getTranslate();

      if (tvLastTranslateRef.current === null) {
        tvLastTranslateRef.current = t;
        return;
      }

      const same = Math.abs(t - tvLastTranslateRef.current) < 0.01;
      tvLastTranslateRef.current = t;

      if (same) tvStallCountRef.current += 1;
      else tvStallCountRef.current = 0;

      const stalledTooLong = tvStallCountRef.current >= 2;
      const notRunning = swiper.autoplay && swiper.autoplay.running === false;

      if (stalledTooLong || notRunning) {
        tvStallCountRef.current = 0;
        swiper.autoplay?.stop();
        swiper.autoplay?.start();
      }
    }, 1000);

    return () => clearInterval(id);
  }, [tvTrending]);

  // Scrubber helpers
  const clamp01 = (n) => Math.max(0, Math.min(1, n));
  const clampWithEdge = (p) =>
    Math.max(EDGE_BUFFER, Math.min(1 - EDGE_BUFFER, clamp01(p)));

  const setTranslateFromProgress = (p) => {
    const swiper = swiperRef.current;
    if (!swiper) return;

    swiper.update();

    const safe = clampWithEdge(p);

    swiper.autoplay?.stop();
    swiper.setTransition(0);

    swiper.setProgress(safe, 0);

    pausedTranslateRef.current = swiper.getTranslate();
  };

  const onScrubPointerDown = (e) => {
    const bar = scrubBarRef.current;
    if (!bar) return;

    isScrubbingRef.current = true;

    const swiper = swiperRef.current;
    if (swiper) {
      swiper.autoplay?.stop();
      if (swiper.wrapperEl) {
        swiper.wrapperEl.style.transitionDuration = "0ms";
      }
    }

    bar.setPointerCapture?.(e.pointerId);

    const rect = bar.getBoundingClientRect();
    const p = clamp01((e.clientX - rect.left) / rect.width);
    setScrubProgress(p);
    setTranslateFromProgress(p);
  };

  const onScrubPointerMove = (e) => {
    if (!isScrubbingRef.current) return;

    const bar = scrubBarRef.current;
    if (!bar) return;

    const rect = bar.getBoundingClientRect();
    const p = clamp01((e.clientX - rect.left) / rect.width);
    setScrubProgress(p);
    setTranslateFromProgress(p);
  };

  const onScrubPointerUp = () => {
    if (!isScrubbingRef.current) return;

    isScrubbingRef.current = false;

    const swiper = swiperRef.current;
    if (!swiper) return;

    if (swiper.wrapperEl) {
      swiper.wrapperEl.style.transitionDuration = "";
    }

    requestAnimationFrame(() => {
      if (isHoveredRef.current) return;
      hardRestartTicker();
    });
  };

  // TV Scrubber helpers
  const setTvTranslateFromProgress = (p) => {
    const swiper = tvSwiperRef.current;
    if (!swiper) return;

    swiper.update();

    const safe = clampWithEdge(p);

    swiper.autoplay?.stop();
    swiper.setTransition(0);

    swiper.setProgress(safe, 0);

    tvPausedTranslateRef.current = swiper.getTranslate();
  };

  const onTvScrubPointerDown = (e) => {
    const bar = tvScrubBarRef.current;
    if (!bar) return;

    tvIsScrubbingRef.current = true;

    const swiper = tvSwiperRef.current;
    if (swiper) {
      swiper.autoplay?.stop();
      if (swiper.wrapperEl) {
        swiper.wrapperEl.style.transitionDuration = "0ms";
      }
    }

    bar.setPointerCapture?.(e.pointerId);

    const rect = bar.getBoundingClientRect();
    const p = clamp01((e.clientX - rect.left) / rect.width);

    setTvScrubProgress(p);
    setTvTranslateFromProgress(p);
  };

  const onTvScrubPointerMove = (e) => {
    if (!tvIsScrubbingRef.current) return;

    const bar = tvScrubBarRef.current;
    if (!bar) return;

    const rect = bar.getBoundingClientRect();
    const p = clamp01((e.clientX - rect.left) / rect.width);

    setTvScrubProgress(p);
    setTvTranslateFromProgress(p);
  };

  const onTvScrubPointerUp = () => {
    if (!tvIsScrubbingRef.current) return;

    tvIsScrubbingRef.current = false;

    const swiper = tvSwiperRef.current;
    if (!swiper) return;

    if (swiper.wrapperEl) {
      swiper.wrapperEl.style.transitionDuration = "";
    }

    requestAnimationFrame(() => {
      if (tvIsHoveredRef.current) return;
      hardRestartTvTicker();
    });
  };

  // Save movie
  const handleSaveTrendingMovie = async (movie) => {
    try {
      const res = await fetch("http://localhost:5050/api/v1/watchlist", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tmdbId: movie.id,
          mediaType: "movie",
          title: movie.title,
          poster_path: movie.poster_path,
          overview: movie.overview,
          release_date: movie.release_date,
          vote_average: movie.vote_average,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Failed to save");
        setTimeout(() => {
          if (!isHoveredRef.current && !isScrubbingRef.current) {
            hardRestartTicker();
          }
        }, 0);
        return;
      }

      if (data.message === "Already in watchlist") {
        toast("Already in your watchlist", { icon: "📌" });
      } else {
        toast.success("Added to watchlist!");
      }

      setTimeout(() => {
        if (!isHoveredRef.current && !isScrubbingRef.current) {
          hardRestartTicker();
        }
      }, 0);
    } catch (err) {
      toast.error("Network error saving movie");
      setTimeout(() => {
        if (!isHoveredRef.current && !isScrubbingRef.current) {
          hardRestartTicker();
        }
      }, 0);
    }
  };

  // Save TV show
  const handleSaveTrendingTv = async (show) => {
    try {
      const res = await fetch("http://localhost:5050/api/v1/watchlist", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tmdbId: show.id,
          mediaType: "tv",
          title: show.name,
          release_date: show.first_air_date,
          poster_path: show.poster_path,
          overview: show.overview,
          vote_average: show.vote_average,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Failed to save");
        setTimeout(() => {
          if (!tvIsHoveredRef.current && !tvIsScrubbingRef.current) {
            hardRestartTvTicker();
          }
        }, 0);
        return;
      }

      if (data.message === "Already in watchlist") {
        toast("Already in your watchlist", { icon: "📌" });
      } else {
        toast.success("Added to watchlist!");
      }

      setTimeout(() => {
        if (!tvIsHoveredRef.current && !tvIsScrubbingRef.current) {
          hardRestartTvTicker();
        }
      }, 0);
    } catch (err) {
      toast.error("Network error saving TV show");
      setTimeout(() => {
        if (!tvIsHoveredRef.current && !tvIsScrubbingRef.current) {
          hardRestartTvTicker();
        }
      }, 0);
    }
  };

  const showScrubber = !loading && moviesTrending.length > 0;
  const showTvScrubber = !loading && tvTrending.length > 0;

  return (
    <>
      <h1>Trending Movies</h1>
      {error && <p>{error}</p>}

      <div ref={tickerWrapRef} style={{ width: "100%" }}>
        <Swiper
          modules={[Autoplay, FreeMode]}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;

            requestAnimationFrame(() => {
              if (!isHoveredRef.current && !isScrubbingRef.current) {
                swiper.autoplay?.start();
              }
            });
          }}
          loop
          slidesPerView="auto"
          spaceBetween={12}
          speed={14000}
          freeMode={{ enabled: true, momentum: false }}
          autoplay={{
            delay: 1,
            disableOnInteraction: false,
            pauseOnMouseEnter: false,
            waitForTransition: false,
            reverseDirection: false,
          }}
          loopAdditionalSlides={10}
          watchSlidesProgress
          observer
          observeParents
          allowTouchMove={false}
          simulateTouch={false}
        >
          {moviesTrending.map((movie) => (
            <SwiperSlide key={movie.id} style={{ width: "auto" }}>
              <TrendingCard movie={movie} onSave={handleSaveTrendingMovie} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {showScrubber && (
        <div
          ref={scrubBarRef}
          onPointerDown={onScrubPointerDown}
          onPointerMove={onScrubPointerMove}
          onPointerUp={onScrubPointerUp}
          onPointerCancel={onScrubPointerUp}
          style={{
            width: "88%",
            height: "14px",
            borderRadius: "999px",
            background: "rgba(0,0,0,0.08)",
            position: "relative",
            margin: "12px auto 4px",
            cursor: "grab",
            touchAction: "none",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: `${scrubProgress * 100}%`,
              top: "50%",
              transform: "translate(-50%, -50%)",
              width: "14px",
              height: "14px",
              borderRadius: "999px",
              background: "rgba(0,0,0,0.35)",
            }}
          />
        </div>
      )}

      <h1>Trending TV Shows</h1>

      <div ref={tvTickerWrapRef} style={{ width: "100%" }}>
        <Swiper
          modules={[Autoplay, FreeMode]}
          onSwiper={(swiper) => {
            tvSwiperRef.current = swiper;

            requestAnimationFrame(() => {
              if (!tvIsHoveredRef.current && !tvIsScrubbingRef.current) {
                swiper.autoplay?.start();
              }
            });
          }}
          loop
          slidesPerView="auto"
          spaceBetween={12}
          speed={14000}
          freeMode={{ enabled: true, momentum: false }}
          autoplay={{
            delay: 1,
            disableOnInteraction: false,
            pauseOnMouseEnter: false,
            waitForTransition: false,
            reverseDirection: false,
          }}
          loopAdditionalSlides={10}
          watchSlidesProgress
          observer
          observeParents
          allowTouchMove={false}
          simulateTouch={false}
        >
          {tvTrending.map((show) => (
            <SwiperSlide key={show.id} style={{ width: "auto" }}>
              <TrendingCard movie={show} onSave={handleSaveTrendingTv} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {showTvScrubber && (
        <div
          ref={tvScrubBarRef}
          onPointerDown={onTvScrubPointerDown}
          onPointerMove={onTvScrubPointerMove}
          onPointerUp={onTvScrubPointerUp}
          onPointerCancel={onTvScrubPointerUp}
          style={{
            width: "88%",
            height: "14px",
            borderRadius: "999px",
            background: "rgba(0,0,0,0.08)",
            position: "relative",
            margin: "12px auto 4px",
            cursor: "grab",
            touchAction: "none",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: `${tvScrubProgress * 100}%`,
              top: "50%",
              transform: "translate(-50%, -50%)",
              width: "14px",
              height: "14px",
              borderRadius: "999px",
              background: "rgba(0,0,0,0.35)",
            }}
          />
        </div>
      )}

      {loading && <p>Loading trending…</p>}
    </>
  );
};

export default HomePage;
