import {useEffect} from "react";
import {useNavigate} from "react-router-dom";

export default function Callback({reload}: { reload: () => Promise<void> }) {
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      await reload();
      navigate("/profile");
    })();
  }, [navigate, reload]);

  return (
    <div className="p-8 text-center">
      <h2>Logging you in...</h2>
    </div>
  );
}
