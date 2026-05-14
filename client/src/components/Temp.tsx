import { useAppSelector } from "@/store/hooks";
import React, { useRef, useState } from "react";

function Temp() {
  const { user } = useAppSelector((state) => state.auth);
  const [status, setStatus] = useState("");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function updateConnWeb() {
    const params =
      " -t updateconnweb -f enc:221037$ln:7$concode:G141P3$TSTDIVMAC$op:updateconnweb";
    setStatus("Update Connection");

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setStatus("");
    }, 5000);

    // Encode the parameters and trigger the custom protocol
    window.location.href = "divdesk:///" + encodeURIComponent(params);
  }

  function setPriLineFAtoAN() {
    const params =
      " -t setprilinefatoan -f enc:220494$ln:3$TSTDIVMAC$op:setprilinefatoan";
    setStatus("Set Line FA to AN");

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setStatus("");
    }, 5000);

    window.location.href = "divdesk:///" + encodeURIComponent(params);
  }

  // Only render the component if the user is "temp1"
  if (user !== "temp1") {
    return null;
  }

  return (
    <div className="flex flex-col items-center text-center justify-center p-10 text-lg">
      {" "}
      <h2>DIVDESK Operations</h2>
      <p style={{ color: "#666", fontSize: "15px" }}>
        Select an operation to execute in the local Primavera environment.
      </p>
      <button
        style={{ borderRadius: "6px" }}
        className="p-4 mt-10 text-sm btn-primary w-[220px]"
        onClick={updateConnWeb}
      >
        🔄 Update Connection Web
      </button>
      <button
        style={{ borderRadius: "6px" }}
        className="p-4 mt-10 text-sm btn-primary w-[220px]"
        onClick={setPriLineFAtoAN}
      >
        🛠️ Set Pri Line FA to AN
      </button>
      {status && (
        <p className="mt-12 text-sm text-gray-500">🚀 Sending: {status}</p>
      )}{" "}
    </div>
  );
}

export default Temp;
