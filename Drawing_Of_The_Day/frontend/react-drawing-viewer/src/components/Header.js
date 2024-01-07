const Header = (prop) => {
    return (
        <>
            <h2>Todays Prompt: {prop.date}</h2>
            <p>{prop.imagePrompt}</p>
        </>
    )
}
export default Header;