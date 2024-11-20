import { currentUser } from "@clerk/nextjs/server";
import NavigationBar from "~/components/common/navigation/navigation-bar";

const Navigation = async () => {
  const clerkUser = await currentUser();

  return (
    <NavigationBar
      clerkUserMetadata={
        clerkUser?.privateMetadata as {
          admin?: boolean;
          approver?: boolean;
          approved?: boolean;
          rejected?: boolean;
        }
      }
    />
  );
};

export default Navigation;
