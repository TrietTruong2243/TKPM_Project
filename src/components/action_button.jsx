import { Button } from "@mui/material";

export const ActionButton = ({icon, bgcolor, small = false, label, handleClick}) => {

    return (
        <Button 
            disableElevation
            fullWidth={false}
            variant='contained' 
            onClick={handleClick} 
            sx=
            {{
                textTransform: 'none',
                bgcolor,
                py: small ? 0.4 : 1,
                px: small ? 1 : 2,
                '&:hover': {
                    bgcolor,
                },
                '&:active': {
                    bgcolor,
                },
            }}  
            startIcon={icon}
        >
            {label}
        </Button>
    )
}