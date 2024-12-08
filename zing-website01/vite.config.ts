export default {
  build: {
    rollupOptions: {
      output: {
        manualChunks(id: string | string[]) {
          if (id.includes("node_modules")) {
            return id
              .toString()
              .split("node_modules/")[1]
              .split("/")[0]
              .toString();
          }
        },
      },
    },
  },
};