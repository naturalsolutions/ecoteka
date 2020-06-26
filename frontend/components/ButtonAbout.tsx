import { Affix, Button } from "antd";

const ButtonAbout: React.FC = () => {
  return (
    <Affix style={{ position: "absolute", right: "1rem", bottom: "1.4rem" }}>
      <Button
        type="primary"
        shape="round"
        href="https://www.natural-solutions.eu/contacts"
        target="_blank"
      >
        En savoir plus
      </Button>
    </Affix>
  );
};

export default ButtonAbout;
