import { withStyles } from "@mui/styles";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Home } from "pages/home";

import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient();

const App = ({ classes }) => {
  // const [metas, setMetas] = useState([]);

  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools />
      <Home />
    </QueryClientProvider>
  );
};

const muiStyles = {
  buttonGroupLayout: {
    display: "flex",
    justifyContent: "center",
    marginTop: "50px",
  },
  parent: {
    display: "flex",
    flexDirection: "column",
    alignItemsf: "center",
  },
};

export default withStyles(muiStyles)(App);
