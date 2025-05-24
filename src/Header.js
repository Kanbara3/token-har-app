const Header = () => {
    const headerStyle = {
        backgroundColor: '#B674A2',
        fontSize: '24',
        padding: '26px',
        marginTop: '0',
        color: 'white',
    };
    return (
        <div style={headerStyle}>
            <h1 style={{margin: 0}}>※非公式 {/*刀剣乱舞ゲームデータ解析*/}サイト</h1>
            <p>
                {/* 刀剣乱舞ONLINEのHARファイル解析サイトです。<br></br>
                同人制作の一環であり、情報収集などの意図は一切ありません。 */}
            </p>
        </div>
    );
}

export default Header;