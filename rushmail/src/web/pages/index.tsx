import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";

function Index() {
  const health = useQuery({
    queryKey: ["health"],
    queryFn: async () => {
      const res = await api.health.$get();
      return res.json();
    },
  });

  return (
    <div>
      <h1>Welcome</h1>
      <p>Platform: Web</p>
      <p>
        API Status:{" "}
        {health.isLoading
          ? "Loading..."
          : health.isError
            ? "Error"
            : health.data?.status}
      </p>
    </div>
  );
}

export default Index;
