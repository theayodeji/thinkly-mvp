import React from "react";
import { TextInput } from "../../components/ui/TextInput";
import { Button } from "../../components/ui/Button";
import { Plus } from "lucide-react";

type Props = {};

const Home = (props: Props) => {
  return (
    <div className="min-h-screen bg-bg">
      <div className="max-w-6xl mx-auto py-6 sm:px-6 lg:px-8">
        <TextInput error="None"/>
        <Button
          variant="primary"
          size="md"
          icon={<Plus className="w-4 h-4" />}
          // loading={true}
        >
          Submit
        </Button>
      </div>
    </div>
  );
};

export default Home;
