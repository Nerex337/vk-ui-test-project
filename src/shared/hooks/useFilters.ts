import { useSearchParams } from "react-router-dom";
import type { ExternalApplicationStatus } from "../../client";

export const useFilters = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const filters = {
      search: searchParams.get("search") || "",
      status: searchParams.get("status") || "",
      type: searchParams.get("type") || "",
    };

    const updateFilters = (
      name: string,
      value: ExternalApplicationStatus | string | number | undefined,
    ) => {
      const newParams = new URLSearchParams(searchParams);

      if (value) {
        newParams.set(name, String(value));
      } else {
        newParams.delete(name);
      }

      setSearchParams(newParams);
    };

    const clearFilters = () => {
      setSearchParams(new URLSearchParams());
    };

    return {filters, updateFilters, clearFilters}
}