import { watch, Ref } from "vue";
import { useRoute, useRouter } from "vue-router";

interface QueryParamProps {
  param: string;
  ref: Ref;
  push: boolean;
  valid: (T) => boolean;
  convertInt: boolean;
}

export function useQueryParam({
  param,
  ref,
  push = false,
  valid,
  convertInt = false,
}: QueryParamProps) {
  const route = useRoute();
  const { path } = route;
  const router = useRouter();
  const routeUpdater = push ? router.push : router.replace;

  const parseParam = (p) =>
    convertInt ? parseInt(p as string) : (p as string);

  if (route.query[param]) {
    const paramVal = parseParam(route.query[param]);
    if (!valid(paramVal)) {
      throw new Error(`Invalid URL query parameter: ${param} = ${paramVal}`);
    }
    ref.value = paramVal;
  } else {
    router.replace({ path, query: { ...route.query, [param]: ref.value } });
  }

  watch(ref, () =>
    routeUpdater({ path, query: { ...route.query, date: ref.value } })
  );
  watch(
    () => route.query,
    () => {
      const paramVal = parseParam(route.query[param]);
      if (paramVal !== ref.value) {
        ref.value = paramVal;
      }
    }
  );
}
