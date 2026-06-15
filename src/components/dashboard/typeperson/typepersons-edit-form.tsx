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

import { paths } from "@/paths";
import { logger } from "@/lib/default-logger";
import { toast } from "@/components/core/toaster";
import { activeTypePerson, deleteTypePerson, updatedTypePerson } from "@/app/dashboard/typepersons/_actions/update-typeperson";

export interface TypePerson {
	id: string;
	name: string;
	inactive: boolean;
}

const schema = zod.object({
	name: zod.string().min(1, "Name is required").max(255),
});

type Values = zod.infer<typeof schema>;

function getDefaultValues(typeperson: TypePerson): Values {
	return {
		name: typeperson.name ?? "",
	};
}

export interface TypePersonEditFormProps {
	typeperson: TypePerson;
}

export function TypePersonEditForm({ typeperson }: TypePersonEditFormProps): React.JSX.Element {
	const router = useRouter();
  	const [isFirstLoading, setIsFirstLoading] = React.useState(false);
  	const [isSalvarLoading, setIsSalvarLoading] = React.useState(false);
  	const [isDeleteLoading, setIsDeleteLoading] = React.useState(false);
	const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);	

	const {
		control,
		handleSubmit,
		formState: { errors },
		getValues,
		setValue,
		watch,
	} = useForm<Values>({ defaultValues: getDefaultValues(typeperson), resolver: zodResolver(schema) });

	const onSubmit = React.useCallback(
		async (_: Values): Promise<void> => {

			setIsSalvarLoading(true);

			const response = await updatedTypePerson({
				id: typeperson.id,
				name: _.name,
			});

			setIsSalvarLoading(false);

			if (response.data && !Array.isArray(response.data)) {
				toast.success("Type person updated");
				router.push(paths.dashboard.typepersons.list);
			} else {
				logger.error(response.error);
				toast.error("Something went wrong!");
			}	
		},
		[router]
	);

	const handleActiveAction = React.useCallback(
		async (): Promise<void> => {
    		setIsFirstLoading(true);

			const response = await activeTypePerson({
				id: typeperson.id,
			});

			setIsFirstLoading(false);

			if (response.data && !Array.isArray(response.data)) {
				toast.success("Type person updated");
				router.push(paths.dashboard.typepersons.list);
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

			const response = await deleteTypePerson({
				id: typeperson.id,
			});

			setIsDeleteLoading(false);

			if (response.data && !Array.isArray(response.data)) {
				toast.success("Type person deleted");
				router.push(paths.dashboard.typepersons.list);
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
									<Typography variant="h6">Basic information</Typography>
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
														<InputLabel required>Typeperson name</InputLabel>
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
							href={paths.dashboard.typepersons.list}
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

							<Button
							//type="submit"
							variant="contained"
							color="warning"
							onClick={handleActiveAction}
							disabled={isFirstLoading || isSalvarLoading || isDeleteLoading}
							startIcon={isFirstLoading ? <CircularProgress size={20} color="inherit" /> : null}
							>
							{typeperson.inactive === true ? 'Activate' : 'Deactivate'}
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