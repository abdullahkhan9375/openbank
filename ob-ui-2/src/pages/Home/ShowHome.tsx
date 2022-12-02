import { BaseButton  } from "../../common";
import { Link } from "react-router-dom";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IShowHome {}

export const ShowHome = (aShowHomeProps: IShowHome) =>
{
    return (
        <div className='container mx-auto flex flex-col items-center justify-center w-screen h-screen' >
        <div className="h-2/5 w-1/2 container mx-auto flex flex-col justify-evenly items-center">
        <h1 className='text-9xl text-white'> OpenBank </h1>
          <p className='text-6xl text-white'> The first B.Y.O.B platform. </p>
        </div>
        <div className='h-2/5 w-2/4 container mx-auto flex flex-row justify-between items-start' >
          <BaseButton color="purple" width="1/2"> <Link to="/user"> Create your bank. </Link></BaseButton> 
          <BaseButton color="orange"> Explore. </BaseButton>
        </div>
      </div>
    )
};
