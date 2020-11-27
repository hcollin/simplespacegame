import {
    createStyles,
    makeStyles,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Theme,
} from "@material-ui/core";
import React, { FC } from "react";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            color: "#FFFD",
            borderColor: "red",
        },
        tableHead: {
            background: "#DDD4",

            border: "none",

            "& th": {
                borderBottom: "solid 2px #0008",
                borderTop: "solid 1px #FFF8",

                fontWeight: "bold",
                padding: "0.25rem 1rem",
                "&.center": {
                    textAlign: "center",
                },
                [theme.breakpoints.down("md")]: {
                    fontSize: "0.7rem",
                },
                [theme.breakpoints.up("lg")]: {
                    fontSize: "1rem",
                },
            },
        },
        tableBody: {
            border: "none",
            "& tr": {
                background: "#3333",
                borderBottom: "solid 1px #0004",
                "&:nth-child(odd)": {
                    background: "#5553",
                },
            },
            "& td": {
                borderBottom: "none",
                color: "#FFFD",

                "&.center": {
                    textAlign: "center",
                },

                "&.redText": {
                    color: "#F00",
                },

                "&.greenText": {
                    color: "#0A0",
                },
                [theme.breakpoints.down("md")]: {
                    fontSize: "0.7rem",
                    "&.bigText": {
                        fontSize: "1rem",
                    },
                },
                [theme.breakpoints.up("lg")]: {
                    fontSize: "1rem",
                    "&.bigText": {
                        fontSize: "1.4rem",
                    },
                },
            },
        },
    })
);

export interface ColumnProps {
    key: string;
    header: string;
    size: number | string;
    className?: string;
    wrapper?: (value: any, item: ObjectType | null, index: number, isHeader: boolean) => any;
    fn?: (item: any) => any;
}

interface ObjectType {
    id: string | number;
    [key: string]: any;
}

export interface DataTableProps {
    columns: ColumnProps[];
    rows: ObjectType[];
    className?: string;
}

const DataTable: FC<DataTableProps> = (props: DataTableProps) => {
    const classes = useStyles();
    return (
        <TableContainer aria-label="simple table">
            <Table classes={{ root: classes.root }}>
                <TableHead classes={{ root: classes.tableHead }}>
                    <TableRow>
                        {props.columns.map((c: ColumnProps) => {
                            const content = c.wrapper !== undefined ? c.wrapper(c.header, null, -1, true) : c.header;
                            return (
                                <TableCell key={c.key} width={c.size} className={c.className || ""}>
                                    {content}
                                </TableCell>
                            );
                        })}
                    </TableRow>
                </TableHead>

                <TableBody classes={{ root: classes.tableBody }}>
                    {props.rows.map((val: any, ind: number) => {
                        return (
                            <TableRow key={val.id}>
                                {props.columns.map((c: ColumnProps) => {
                                    const value = c.fn ? c.fn(val) : val[c.key];
                                    const content = c.wrapper !== undefined ? c.wrapper(value, val, ind, false) : value;
                                    return (
                                        <TableCell key={`${val.id}-${c.key}`} className={c.className || ""}>
                                            {content}
                                        </TableCell>
                                    );
                                })}
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default DataTable;
