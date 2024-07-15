interface HomeLayoutProps {
  modal: React.ReactNode;
  children: React.ReactNode;
}

export default function HomeLayout({ modal, children }: HomeLayoutProps) {
  return (
    <>
      {children}
      {modal}
    </>
  );
}
