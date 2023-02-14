const InitialAppState = {
  session: {
    user: {},
  },
  collection: [
    {
      graph: {
        nodes: [],
        links: [],
      },
      settings: {
        simulation: {},
      },
    },
  ],
  settings: {
    theme: {},
  },
};

function useAppState() {
  return {};
}

export default { useAppState };
