import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
const NavBar = () => {
	const [top, setTop] = useState(false)
	const listener = () => {
		if (window.scrollY > 50) {
			setTop(true)
		} else {
			setTop(false)
		}
	}
	useEffect(() => {
		window.addEventListener('scroll', listener)
		return () => {
			window.removeEventListener('scroll', listener)
		}
	}, [])
	return (
		<NavWrapper top={top}>
			<Logo>
				<Image
					alt="poke logo"
					src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png"
					onClick={() => (window.location.href = '/')}
				/>
			</Logo>
		</NavWrapper>
	)
}

const Image = styled.img`
	cursor: pointer;
	width: 100%;
`
const Logo = styled.a`
	padding: 0;
	width: 50px;
	margin-top: 4px;
`

const NavWrapper = styled.nav`
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	height: 70px;
	display: flex;
	justify-content: space-between;
	backdrop-filter: ${(props) => (props.top ? 'blur(50px)' : 'none')};
	align-items: center;
	padding: 0 36px;
	letter-spacing: 16px;
	z-index: 100;
`
export default NavBar
