import React, {useState, useEffect} from 'react';
import {NavLink, Link, useLocation} from 'react-router-dom';
import Logo from '../images/logo.png';
import '../css/Header.css';
import {fetchWithAuth, isLoggedIn, logout} from '../utils/api';

const Header = () => {
    const location = useLocation();
    const [loggedIn, setLoggedIn] = useState(false);
    const [userName, setUserName] = useState('');
    const [userNickname, setUserNickname] = useState('');

    // 로그인 상태 확인 및 사용자 정보 조회
    useEffect(() => {
        const checkLoginStatus = async () => {
            if (isLoggedIn()) {
                try {
                    const response = await fetchWithAuth('/member/me');
                    if (response.ok) {
                        const data = await response.json();
                        setLoggedIn(true);
                        setUserName(data.memName || '');
                        setUserNickname(data.memNickname || '');
                    } else {
                        setLoggedIn(false);
                        setUserName('');
                        setUserNickname('');
                    }
                } catch (error) {
                    setLoggedIn(false);
                    setUserName('');
                    setUserNickname('');
                }
            } else {
                setLoggedIn(false);
                setUserName('');
                setUserNickname('');
            }
        };

        checkLoginStatus();
        
        const handleLoginStatusChange = () => {
            checkLoginStatus();
        };
        window.addEventListener('loginStatusChanged', handleLoginStatusChange);
        
        return () => {
            window.removeEventListener('loginStatusChanged', handleLoginStatusChange);
        };
    }, [location.pathname]);

    // 로그아웃 처리 및 상태 초기화
    const handleLogout = () => {
        logout();
        setLoggedIn(false);
        setUserName('');
        setUserNickname('');
    };

    return (
        <div>
            <header className="header">
                <div className="header_top">
                    <div className="top_inner">
                        <ul className="top_list">
                            {loggedIn && (userName || userNickname) && (
                                <li className="top_item greet">
                                    <b>{userName || userNickname}</b>님, 안녕하세요!
                                </li>
                            )}
                            <li className="top_item">고객센터</li>
                            <li className="top_item">알림</li>
                            <li className="top_item">
                                {loggedIn ? (
                                    <div onClick={handleLogout} style={{cursor: 'pointer'}}>로그아웃</div>
                                ) : (
                                    <Link to="/login" className="top_item">로그인</Link>
                                )}
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="header_main">
                    <div className="main_inner">
                        <h1>
                            <NavLink to="/">
                                <img src={Logo} alt="logo.png" className="logo"/>
                            </NavLink>
                        </h1>
                        <div className="center">
                            <nav id="gnb_container" className="gnb">
                                <ul id="gnb_list" className="gnb_list">
                                    <li className="gnb_item"><NavLink 
                                                            to="/" 
                                                            className={({isActive}) => 
                                                                isActive ? 'gnb_link active' : 'gnb_link'}>HOME</NavLink></li>
                                    <li className="gnb_item"><NavLink 
                                                            to="/shop" 
                                                            className={({isActive}) => 
                                                                isActive ? 'gnb_link active' : 'gnb_link'}>SHOP</NavLink></li>
                                    <li className="gnb_item"><NavLink 
                                                            to="/comate" 
                                                            className={({isActive}) => 
                                                                isActive ? 'gnb_link active' : 'gnb_link'}>CO-MATE</NavLink></li>
                                    <li className="gnb_item"><div className="gnb_link">EVENT</div></li>
                                </ul>
                            </nav>
                        </div>
                        <div className="right">  
                            <div className="search_container">
                                <form onSubmit={(e) => {
                                                e.preventDefault(); 
                                                const searchValue = e.target.search.value;

                                                if (searchValue == "") {
                                                    alert("검색어를 입력하세요");
                                                } else {
                                                    console.log('검색 실행:', searchValue);
                                                }
                                }}>
                                    <input type="text" name="search" placeholder="검색어를 입력해보세요" />
                                    <button type="submit" className="btn_search">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="" viewBox="0 0 24 24" width="20" height="20">
                                            <path fill="#777777" fillRule="evenodd" d="M15.571 16.631a8.275 8.275 0 1 1 1.06-1.06l4.5 4.498-1.061 1.06-4.499-4.498Zm1.478-6.357a6.775 6.775 0 1 1-13.55 0 6.775 6.775 0 0 1 13.55 0Z" clipRule="evenodd"></path>
                                        </svg>
                                    </button>
                                </form>
                            </div>
                            <a className="btn_cart">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width="24" height="24">
                                    <path fill="#222" fillRule="evenodd" d="M16.192 5.2h3.267a1 1 0 0 1 .998.938l.916 14.837a.4.4 0 0 1-.399.425H3.025a.4.4 0 0 1-.4-.425l.917-14.837A1 1 0 0 1 4.54 5.2h3.267a4.251 4.251 0 0 1 8.385 0ZM7.75 6.7H5.01l-.815 13.2h15.61l-.816-13.2h-2.74v2.7h-1.5V6.7h-5.5v2.7h-1.5V6.7Zm1.59-1.5h5.32a2.751 2.751 0 0 0-5.32 0Z" clipRule="evenodd"></path>
                                </svg>
                            </a>
                            <a className="btn_category">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width="24" height="24">
                                    <path fill="#222" d="M3 5.61h18v1.8H3v-1.8ZM3 11.1h18v1.8H3v-1.8ZM21 16.595H3v1.8h18v-1.8Z"></path>
                                </svg>
                            </a>
                        </div> 
                    </div>
                </div>
            </header>
        </div>
    );
}

export default Header;