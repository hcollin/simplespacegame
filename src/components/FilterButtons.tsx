import { Button, ButtonGroup } from "@material-ui/core";
import React, { FC } from "react";

interface Props {
	values: string[];

	selected: string;
	onChange: (value: string) => void;
    texts?: string[];
    className?: string;
}

const FilterButtons: FC<Props> = (props) => {
	return (
		<ButtonGroup variant="contained" className={`${props.className || ""}`}>
			{props.values.map((s: string, ind: number) => {
				return (
					<Button key={s} color={props.selected === s ? "primary" : "default"}
                    onClick={() => props.onChange(s)}>
						{props.texts ? props.texts[ind] : s}
					</Button>
				);
			})}
		</ButtonGroup>
	);
};

export default FilterButtons;
