import { Container, Paper, Typography, Divider } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    padding: theme.spacing(3),
  },
  divider: {
    margin: theme.spacing(3),
  },
  title: {
    margin: theme.spacing(1),
  },
}));

const LegacyPage = () => {
  const classes = useStyles();

  return (
    <Container>
      <Paper className={classes.paper}>
        <Container>
          <Typography variant="h3" align="center" className={classes.title}>
            Mentions Légales
          </Typography>

          <Divider variant="middle" className={classes.divider} />

          <Typography variant="h5" align="center" className={classes.title}>
            Présentation du site EcoTeka
          </Typography>
          <Typography variant="body2" component="p">
            Notre site https://ecoteka.org/ est réalisé et édité par Natural
            Solutions. La gestion du site internet est opéré par la SAS Natural
            Solutions, au capital de 100 000 euros, dont le siège social se
            situe 68 Rue Sainte 13003 MARSEILLE. <br /> Propriétaire : SAS
            Natural Solutions, 68 Rue Sainte 13001 MARSEILLE – FRANCE
            <br /> Fondateur : Oliver ROVELLOTTI
            olivier_rovellotti@natural-solutions.eu
            <br />
            Responsable publication : Manon FREDOUT <br />
            Hébergeur : OVH cloud
            <br />
            Graphisme : Naomi FISCHER / Manon DE CONINGH
          </Typography>

          <Divider variant="middle" className={classes.divider} />

          <Typography variant="h5" align="center" className={classes.title}>
            Politique des cookies
          </Typography>
          <Typography variant="body2" component="p">
            La navigation sur le site https://ecoteka.org/ est susceptible de
            provoquer l’installation de cookie(s) sur l’ordinateur de
            l’utilisateur. Un cookie est un fichier de petite taille, qui ne
            permet pas l’identification de l’utilisateur, mais qui enregistre
            des informations relatives à la navigation d’un ordinateur sur un
            site. Les données ainsi obtenues visent à faciliter la navigation
            ultérieure sur le site, et ont également vocation à permettre
            diverses mesures de fréquentation.
          </Typography>

          <Divider variant="middle" className={classes.divider} />

          <Typography variant="h5" align="center" className={classes.title}>
            Source des données
          </Typography>
          <Typography variant="body2" component="p">
            Les données collectées et retranscrites sur le site EcoTeka
            proviennent notamment des sites : OpenStreetMap
            <br />
            https://github.com/maplibre/maplibre-gl-js
            <br />
            https://deck.gl/
            <br />
            https://api.gouv.fr/les-api/api_carto_cadastre
          </Typography>

          <Divider variant="middle" className={classes.divider} />

          <Typography variant="h5" align="center" className={classes.title}>
            Données personnelles
          </Typography>
          <Typography variant="body2" component="p">
            A l’occasion de l’utilisation du site https://ecoteka.org/ peuvent
            être recueillies : l’URL des liens par l’intermédiaire desquels
            l’utilisateur a accédé au site https://ecoteka.org/, le fournisseur
            d’accès de l’utilisateur, l’adresse de protocole Internet (IP) de
            l’utilisateur. <br />
            En tout état de cause EcoTeka ne collecte des informations
            personnelles relatives à l’utilisateur que pour le besoin de
            certains services proposés par le site. L’utilisateur fournit ces
            informations en toute connaissance de cause, notamment lorsqu’il
            procède par lui-même à leur saisie. Il est alors précisé à
            l’utilisateur de notre site l’obligation ou non de fournir ces
            informations. <br />
            Aucune information personnelle de l’utilisateur du site
            https://ecoteka.org/ n’est publiée à l’insu de l’utilisateur,
            échangée, transférée, cédée ou vendue sur un support quelconque à
            des tiers. <br />
            Les bases de données sont protégées par les dispositions de la loi
            du 1er juillet 1998 transposant la directive 96/9 du 11 mars 1996
            relative à la protection juridique des bases de données.
            <br /> Conformément à l’article 32 de la Loi Informatique et Liberté
            du 6 janvier 1978, les utilisateurs du site EcoTeka ont le droit
            d’accès aux données à caractère personnel confiées et archivées,
            ainsi que le droit de s’opposer à ces données en demandant leur
            modification ou leur suppression. <br />
            Si vous souhaitez que vos renseignements soient supprimés ou
            modifiés, Veuillez contacter notre délégué à la protection des
            données aux coordonnées suivantes :<br /> 68 Rue Sainte, 13001,
            Marseille
            <br />
            dpo@natural-solutions.eu <br />
            04 91 72 00 26
          </Typography>

          <Divider variant="middle" className={classes.divider} />

          <Typography variant="h5" align="center" className={classes.title}>
            Pour nous contacter directement :
          </Typography>
          <Typography variant="body2" component="p" align="center">
            04 91 72 00 26 <br />
            contact [@] natural-solutions.eu
          </Typography>
        </Container>
      </Paper>
    </Container>
  );
};

export default LegacyPage;
