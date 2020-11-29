import { useTheme, useMediaQuery } from "@material-ui/core";

export default function useMobileMode(): boolean {
	const theme = useTheme();
	const matches = useMediaQuery(theme.breakpoints.down("md"));

	return matches;
}
