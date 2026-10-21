import { ImageResponse } from "next/og";
import { profile } from "@/content/profile";

export const alt = `${profile.name}, ${profile.role} (${profile.roleTag})`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  const stages = ["checkout", "build", "test", "sign", "deploy", "verify"];
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#0a0a0a",
          color: "#ffffff",
          backgroundImage: "radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 10,
              background: "#ff7a17",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 20,
              fontWeight: 700,
            }}
          >
            FS
          </div>
          <div style={{ fontSize: 26, color: "#dadbdf" }}>{profile.name}</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 24, color: "#ffc285", marginBottom: 18 }}>
            {`${profile.role} · ${profile.roleTag}`}
          </div>
          <div style={{ fontSize: 68, fontWeight: 700, letterSpacing: -2.5, lineHeight: 1.05, maxWidth: 940 }}>
            {profile.headline}
          </div>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          {stages.map((s) => (
            <div
              key={s}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 14px",
                borderRadius: 8,
                border: "1px solid #212327",
                background: "#191919",
                fontSize: 20,
                color: "#dadbdf",
              }}
            >
              <div style={{ width: 9, height: 9, borderRadius: 9, background: "#27a644" }} />
              {s}
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
