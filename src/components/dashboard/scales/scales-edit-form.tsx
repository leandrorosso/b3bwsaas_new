"use client";

import * as React from "react";
import RouterLink from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CircularProgress from '@mui/material/CircularProgress';
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import Grid from "@mui/material/Grid2";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Controller, useForm } from "react-hook-form";
import { z as zod } from "zod";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import  Switch, { SwitchProps }  from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import { styled } from '@mui/material/styles';

import { paths } from "@/paths";
import { logger } from "@/lib/default-logger";
import { toast } from "@/components/core/toaster";
import { activeScale, deleteScale, updatedScale } from "@/app/dashboard/scales/_actions/update-scales";

export interface Scale {
	id: string;
	name: string;
	inactive: boolean;
}

const schema = zod.object({
	name: zod.string().min(1, "Name is required").max(255),
});

type Values = zod.infer<typeof schema>;

function getDefaultValues(scale: Scale): Values {
	return {
		name: scale.name ?? "",
	};
}

export interface ScaleEditFormProps {
	scale: Scale;
}

const IOSSwitch = styled((props: SwitchProps) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 42,
  height: 26,
  padding: 0,
  '& .MuiSwitch-switchBase': {
    padding: 0,
    margin: 2,
    transitionDuration: '300ms',
    '&.Mui-checked': {
      transform: 'translateX(16px)',
      color: '#fff',
      '& + .MuiSwitch-track': {
        backgroundColor: '#65C466',
        opacity: 1,
        border: 0,
        ...theme.applyStyles('dark', {
          backgroundColor: '#2ECA45',
        }),
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        opacity: 0.5,
      },
    },
    '&.Mui-focusVisible .MuiSwitch-thumb': {
      color: '#33cf4d',
      border: '6px solid #fff',
    },
    '&.Mui-disabled .MuiSwitch-thumb': {
      color: theme.palette.grey[100],
      ...theme.applyStyles('dark', {
        color: theme.palette.grey[600],
      }),
    },
    '&.Mui-disabled + .MuiSwitch-track': {
      opacity: 0.7,
      ...theme.applyStyles('dark', {
        opacity: 0.3,
      }),
    },
  },
  '& .MuiSwitch-thumb': {
    boxSizing: 'border-box',
    width: 22,
    height: 22,
  },
  '& .MuiSwitch-track': {
    borderRadius: 26 / 2,
    backgroundColor: '#E9E9EA',
    opacity: 1,
    transition: theme.transitions.create(['background-color'], {
      duration: 500,
    }),
    ...theme.applyStyles('dark', {
      backgroundColor: '#39393D',
    }),
  },
}));

export function ScaleEditForm({ scale }: ScaleEditFormProps): React.JSX.Element {
	const router = useRouter();
  	const [isFirstLoading, setIsFirstLoading] = React.useState(false);
  	const [isSalvarLoading, setIsSalvarLoading] = React.useState(false);
  	const [isDeleteLoading, setIsDeleteLoading] = React.useState(false);
	const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);	
	const [isActive, setIsActive] = React.useState(!scale.inactive);	

	const {
		control,
		handleSubmit,
		formState: { errors },
		getValues,
		setValue,
		watch,
	} = useForm<Values>({ defaultValues: getDefaultValues(scale), resolver: zodResolver(schema) });

	const onSubmit = React.useCallback(
		async (_: Values): Promise<void> => {

			setIsSalvarLoading(true);

			const response = await updatedScale({
				id: scale.id,
				name: _.name,
			});

			setIsSalvarLoading(false);

			if (response.data && !Array.isArray(response.data)) {
				toast.success("Scale updated");
				router.push(paths.dashboard.scales.list);
			} else {
				logger.error(response.error);
				toast.error("Something went wrong!");
			}	
		},
		[router]
	);

	const handleActiveAction = React.useCallback(
		async (checked: boolean): Promise<void> => {
    		setIsFirstLoading(true);

			const response = await activeScale({
				id: scale.id,
			});

			setIsFirstLoading(false);

			if (response.data && !Array.isArray(response.data)) {
				toast.success("Scale updated");
				router.push(paths.dashboard.scales.list);
			} else {
				logger.error(response.error);
				toast.error("Something went wrong!");
			}	
		},
		[router]
	);

	const handleDeleteAction = React.useCallback(
		async (): Promise<void> => {
      		setOpenDeleteDialog(false);			
    		setIsDeleteLoading(true);

			const response = await deleteScale({
				id: scale.id,
			});

			setIsDeleteLoading(false);

			if (response.data && !Array.isArray(response.data)) {
				toast.success("Scale deleted");
				router.push(paths.dashboard.scales.list);
			} else {
				logger.error(response.error);
				toast.error("Something went wrong!");
			}	
		},
		[router]
	);

	const name = watch("name");

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<Grid container spacing={4}>
				<Grid
					size={{
						md: 12,
						xs: 12,
					}}
				>
					<Card>
						<CardContent>
							<Stack divider={<Divider />} spacing={4}>
								<Stack spacing={3}>
									<Stack
										direction="row"
										justifyContent="space-between"
										alignItems="center"
									>
										<Typography variant="h6">Basic information</Typography>
										<FormControlLabel
											control={
												<IOSSwitch 
													sx={{ m: 1 }}
													checked={isActive}
													onChange={(_, checked) => handleActiveAction(checked)}
													disabled={isFirstLoading || isSalvarLoading || isDeleteLoading}
												/>
											}
											label={
												isFirstLoading ? (
													<CircularProgress size={20} />
												) : (
													isActive ? "Active" : "Inactive"
												)
											}
										/>	
									</Stack>
									<Grid container spacing={3}>
										<Grid
											size={{
												md: 12,
												xs: 12,
											}}
										>
											<Controller
												control={control}
												name="name"
												render={({ field }) => (
													<FormControl error={Boolean(errors.name)} fullWidth>
														<InputLabel required>Scale name</InputLabel>
														<OutlinedInput {...field} />
														{errors.name ? <FormHelperText>{errors.name.message}</FormHelperText> : null}
													</FormControl>
												)}
											/>
										</Grid>
									</Grid>
								</Stack>
							</Stack>
						</CardContent>
						<CardActions sx={{ justifyContent: "flex-end", gap: 1 }}>
							{/* Botão de Excluir (Agora no início e com margin-right auto para colar na esquerda) */}
							<Button
							variant="contained"
							color="error"
							onClick={() => setOpenDeleteDialog(true)}
							disabled={isFirstLoading || isSalvarLoading || isDeleteLoading}
							sx={{ marginRight: "auto" }} 
							>
							Delete
							</Button>

							{/* Botões alinhados à direita */}
							<Button 
							color="secondary" 
							variant="contained"
							component={RouterLink} 
							href={paths.dashboard.scales.list}
							>
							Cancel
							</Button>

							<Button 
							type="submit" 
							variant="contained"
							disabled={isFirstLoading || isSalvarLoading || isDeleteLoading}
							startIcon={isSalvarLoading ? <CircularProgress size={20} color="inherit" /> : null}
							>               
							Save changes
							</Button>					
						</CardActions>

						{/* O Dialog fica melhor posicionado fora do CardActions para não quebrar o layout flex */}
						<Dialog
							open={openDeleteDialog}
							onClose={() => setOpenDeleteDialog(false)}
						>
							<DialogTitle>Confirm Deletion ?</DialogTitle>
							<DialogContent>
							<DialogContentText>
								Are you sure you want to delete this record? This action cannot be undone.
							</DialogContentText>
							</DialogContent>
							<DialogActions>
							<Button 
								onClick={() => setOpenDeleteDialog(false)} 
								variant="contained" 
								color="secondary"
								disabled={isDeleteLoading}
							>
								Cancel
							</Button>
							<Button 
								onClick={handleDeleteAction} 
								color="error" 
								variant="contained" 
								autoFocus
								disabled={isFirstLoading || isSalvarLoading || isDeleteLoading}
								startIcon={isDeleteLoading ? <CircularProgress size={20} color="inherit" /> : null}                    
							>
								Confirm and Delete
							</Button>
							</DialogActions>
						</Dialog>


					</Card>
				</Grid>
			</Grid>
		</form>
	);
}