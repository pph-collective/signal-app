import { defineStore } from "pinia";

interface Color {
  code: string;
  assigned: boolean;
}

export const useColorMap = defineStore("colorMap", {
  state: (): { colors: Record<string, string> } => {
    return {
      colors: {},
    };
  },
  actions: {
    update({ ids, unique = true }: { ids: string[]; unique?: boolean }) {
      const curKeys = Object.keys(this.colors);
      let nextColorInd = unique ? COLORS.findIndex((c) => !c.assigned) : 0;
      ids.forEach((id) => {
        if (!curKeys.includes(id)) {
          this.colors[id] = COLORS[nextColorInd].code;
          if (unique) {
            COLORS[nextColorInd].assigned = true;
          }
          nextColorInd++;
        }
      });
    },
  },
  getters: {
    getColorRange() {
      return (ids: string[]) => ids.map((id) => this.colors[id]);
    },
  },
});

const COLORS: Color[] = [
  { code: "#2e0d93", assigned: false },
  { code: "#fd5925", assigned: false },
  { code: "#3f6f94", assigned: false },
  { code: "#daa4f9", assigned: false },
  { code: "#6fcf1d", assigned: false },
  { code: "#801967", assigned: false },
  { code: "#f1d438", assigned: false },
  { code: "#1dfee1", assigned: false },
  { code: "#f35c79", assigned: false },
  { code: "#faa566", assigned: false },
  { code: "#456fe7", assigned: false },
  { code: "#9f6c3b", assigned: false },
  { code: "#87c4c1", assigned: false },
  { code: "#5a3100", assigned: false },
  { code: "#972b2d", assigned: false },
  { code: "#1fa562", assigned: false },
  { code: "#ca50d3", assigned: false },
  { code: "#1d2150", assigned: false },
  { code: "#7212ff", assigned: false },
  { code: "#6a7d54", assigned: false },
];
