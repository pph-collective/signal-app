import { reactive } from "vue";
import hash from "object-hash";

import { Coordinate, Variable } from "../utils/erddap";

interface Query {
  variables: Variable[];
  coordinates: Coordinate[];
  startDate: string;
  endDate: string;
  hash: string;
}

export function useQuery(store, routePath: string) {
  const query = reactive({}) as Query;
  const path = routePath;

  const updateQuery = (routeQuery, routePath: string) => {
    if (path !== routePath) return;
    const copyQuery = { ...routeQuery };
    const vars = ["variables", "start", "end", "ids"];
    vars.forEach((v) => {
      if (routeQuery[v]) {
        copyQuery[v] = ["variables", "ids"].includes(v)
          ? routeQuery[v].split(",")
          : routeQuery[v];
      } else {
        throw new Error(`Missing required query parameter: ${v}`);
      }
    });

    query.variables = store.variables.filter((v) =>
      copyQuery.variables.includes(v.name)
    );
    query.coordinates = store.coordinates.filter((c) =>
      copyQuery.ids.includes(c.buoyId)
    );

    query.startDate = copyQuery.start;
    query.endDate = copyQuery.end;

    // used as a key to make sure things re-load with spinner
    query.hash = hash(copyQuery);
  };

  return {
    query,
    updateQuery,
  };
}
