import { useState } from "react";
export function useStub() {
  const [state] = useState(null);
  return { state };
}
