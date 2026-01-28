

const CommonLayout = ({children} : {children:React.ReactNode}) => {
    return (
        <div>
           <p>hello common layout</p>
            {children}
        </div>
    );
};

export default CommonLayout; 