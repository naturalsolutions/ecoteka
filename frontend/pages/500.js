import { Button } from "@material-ui/core";
import { useRouter } from "next/router";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";


const useStyles = makeStyles((theme) => (
    {  
        root: {    
            height: "100vh",    
            width: "100vw",
            background: "no-repeat url('./assets/background_500.svg')",
            backgroundSize: "cover",
            backgroundPosition: "bottom",
        },
        figure: {
            padding: "100px 0px 30px 0px",
            textAlign: "center",
        },
        figcaption: {
            fontSize: "18px",
            padding: "20px",
            color: "#fff",
        },
        button: {
            padding: "10px 20px",
        },
        credit: {
            position: "absolute",
            bottom: "5px",
            right: "10px",
            color: "#fff",
            fontSize: "12px",
        }
    }
));
export default function Page404() { 
    const classes = useStyles();  
    const router = useRouter();
    const onClick = () => {
        router.push("/");  
    };
    return (    
        <Grid container direction="column" justify="top" alignItems="center" className={classes.root}  >   
            <figure className={classes.figure}>
                <img alt="Erreur 500" src="./assets/erreur_500.svg" width="400px"/>
                <figcaption className={classes.figcaption}>La météo ne nous est pas favorable ! <br></br>Attendez un peu et réessayez quand les nuages seront passés.</figcaption>  
            </figure>
            <Button className={classes.button} color="primary" variant="contained" onClick={onClick}> Retourner sur la page initiale </Button>   
            <span className={classes.credit}>Designed by Pikisuperstar - fr.freepik.com</span>
        </Grid>  
    );
}