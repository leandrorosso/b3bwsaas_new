"use client";

import * as React from "react";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { DotsThree as DotsThreeIcon } from "@phosphor-icons/react/dist/ssr/DotsThree";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { Trash as TrashIcon } from "@phosphor-icons/react/dist/ssr/Trash";

import { DataTable } from "@/components/core/data-table";
import type { ColumnDef } from "@/components/core/data-table";
import type { Scale } from "@/components/dashboard/scales/scales-table";

export interface ScalesTableProps {
  rows: Scale[];
  onDeleteScale: (scale: Scale) => Promise<void>;
}

interface RowActionsProps {
  row: Scale;
  onDeleteScale: (scale: Scale) => Promise<void>;
}

function RowActions({ row, onDeleteScale }: RowActionsProps): React.JSX.Element {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const open = Boolean(anchorEl);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>): void => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = (): void => {
    setAnchorEl(null);
  };

  const handleOpenConfirm = (): void => {
    handleMenuClose();
    setConfirmOpen(true);
  };

  const handleCloseConfirm = (): void => {
    if (!loading) {
      setConfirmOpen(false);
    }
  };

  const handleDelete = async (): Promise<void> => {
    try {
      setLoading(true);
      await onDeleteScale(row);
      setConfirmOpen(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <IconButton aria-label="Row actions" onClick={handleMenuOpen}>
        <DotsThreeIcon weight="bold" />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MenuItem onClick={handleOpenConfirm}>
          <ListItemIcon>
            <TrashIcon size={18} color="red" />
          </ListItemIcon>

          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>

      <Dialog
        open={confirmOpen}
        onClose={handleCloseConfirm}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Confirm Delete?</DialogTitle>

        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the scale
            <strong> "{row.name}"</strong>?
            <br />
            <br />
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseConfirm} disabled={loading}>
            Cancel
          </Button>

          <Button
            color="error"
            variant="contained"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

const getColumns = (
  onDeleteScale: (scale: Scale) => Promise<void>
): ColumnDef<Scale>[] => [
  {
    formatter: (row): React.JSX.Element => (
      <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
        <Typography variant="subtitle2">{row.name}</Typography>
      </Stack>
    ),
    name: "Name",
    width: "350px",
  },
  {
    formatter: (row): React.JSX.Element => (
      <RowActions row={row} onDeleteScale={onDeleteScale} />
    ),
    name: "Actions",
    hideName: true,
    width: "100px",
    align: "right",
  },
];

export function ScalesTable({
  rows,
  onDeleteScale,
}: ScalesTableProps): React.JSX.Element {
  const columns = React.useMemo(
    () => getColumns(onDeleteScale),
    [onDeleteScale]
  );

  return (
    <DataTable<Scale>
      columns={columns}
      rows={rows}
    />
  );
}