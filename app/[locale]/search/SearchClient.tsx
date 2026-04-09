"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations, useLocale } from "next-intl";

declare global {
  interface Window {
    nova_iframe_options?: {
      baseUrl: string;
      lang: string;
      containerId: string;
      target: string;
      domain: string;
      wid: string;
    };
  }
}

const NOVA_SCRIPT_SRC = "https://www.novaturas.lt/static/js/iframe.js";
const CONTAINER_ID = "nova-container";

type Status = "loading" | "ready" | "error";

type SearchState = {
  status: Status;
  error: string | null;
};

export default function SearchPage() {
  const t = useTranslations("searchPage");
  const locale = useLocale();

  const containerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<MutationObserver | null>(null);
  const loadTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [retryCount, setRetryCount] = useState(0);
  const [searchState, setSearchState] = useState<SearchState>({
    status: "loading",
    error: null,
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let cancelled = false;

    const cleanup = () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }

      if (loadTimeoutRef.current) {
        clearTimeout(loadTimeoutRef.current);
        loadTimeoutRef.current = null;
      }
    };

    const markReady = () => {
      if (cancelled) return;
      cleanup();
      setSearchState({
        status: "ready",
        error: null,
      });
    };

    const markError = (message: string) => {
      if (cancelled) return;
      cleanup();
      setSearchState({
        status: "error",
        error: message,
      });
    };

    container.innerHTML = "";

    window.nova_iframe_options = {
      baseUrl: "https://koradius-travel.com",
      lang: locale,
      containerId: CONTAINER_ID,
      target: "search",
      domain: "https://www.novaturas.lt",
      wid: "kelkoradius111",
    };

    const existingIframe = container.querySelector("iframe");
    if (existingIframe) {
      markReady();
      return cleanup;
    }

    observerRef.current = new MutationObserver(() => {
      const iframe = container.querySelector("iframe");
      if (iframe) {
        markReady();
      }
    });

    observerRef.current.observe(container, {
      childList: true,
      subtree: true,
    });

    const existingScript = document.querySelector<HTMLScriptElement>(
      `script[src="${NOVA_SCRIPT_SRC}"]`
    );

    const initTimeout = () => {
      loadTimeoutRef.current = setTimeout(() => {
        const iframe = container.querySelector("iframe");
        if (!iframe) {
          markError(t("error.title"));
        }
      }, 8000);
    };

    if (existingScript) {
      initTimeout();
    } else {
      const script = document.createElement("script");
      script.src = NOVA_SCRIPT_SRC;
      script.async = true;

      script.onload = () => {
        if (cancelled) return;
        initTimeout();
      };

      script.onerror = () => {
        markError(t("networkError"));
      };

      document.head.appendChild(script);
    }

    return () => {
      cancelled = true;
      cleanup();
      container.innerHTML = "";
    };
  }, [locale, retryCount, t]);

  const handleRetry = () => {
    setSearchState({
      status: "loading",
      error: null,
    });
    setRetryCount((prev) => prev + 1);
  };

  const isLoading = searchState.status === "loading";
  const isError = searchState.status === "error";

  return (
    <div
      className="search-page-container"
      style={{
        minHeight: "100vh",
        position: "relative",
        width: "100%",
        backgroundColor: "#f8fafc",
      }}
    >
      <style>{`
        .search-page-container {
          position: relative;
          z-index: 1;
        }

        .loading-spinner {
          border: 4px solid #e2e8f0;
          border-top: 4px solid #3b82f6;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
          margin: 0 auto 16px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>

      {isLoading && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#f8fafc",
            zIndex: 100,
          }}
        >
          <div style={{ textAlign: "center", padding: "24px" }}>
            <div className="loading-spinner" />
            <p
              style={{
                color: "#64748b",
                fontSize: "16px",
                fontWeight: "500",
              }}
            >
              {t("loading.title")}
            </p>
            <p style={{ color: "#94a3b8", fontSize: "14px" }}>
              {t("loading.subtitle")}
            </p>
          </div>
        </div>
      )}

      {isError && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#fef2f2",
            zIndex: 100,
          }}
        >
          <div
            style={{
              textAlign: "center",
              padding: "32px",
              backgroundColor: "white",
              borderRadius: "12px",
              boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
              maxWidth: "400px",
              margin: "0 16px",
            }}
          >
            <div style={{ fontSize: "64px", marginBottom: "16px" }}>⚠️</div>
            <h3
              style={{
                color: "#dc2626",
                fontSize: "18px",
                fontWeight: "600",
              }}
            >
              {t("error.title")}
            </h3>
            <p
              style={{
                color: "#6b7280",
                fontSize: "14px",
                marginBottom: "24px",
              }}
            >
              {searchState.error}
            </p>
            <button
              onClick={handleRetry}
              style={{
                padding: "12px 24px",
                backgroundColor: "#3b82f6",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "500",
              }}
            >
              {t("error.retryButton")}
            </button>
          </div>
        </div>
      )}

      <div
        id={CONTAINER_ID}
        ref={containerRef}
        style={{
          width: "100%",
          minHeight: "100vh",
          position: "relative",
          zIndex: 1,
        }}
      />
    </div>
  );
}