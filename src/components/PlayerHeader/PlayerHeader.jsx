import React from 'react';
import {useSelector, useDispatch} from 'react-redux';
import styles from './PlayerHeader.module.scss';
import logo from '../../img/goiteensLOGO.png';
import logout from '../../img/logout.svg';


export default function PlayerHeader() {
	const userName = useSelector((state) => state.auth.user.name);
	const userId = useSelector((state) => state.auth.user.id);
	const dispatch = useDispatch();


	return (
		<>
			<div className={styles.list__wrapper}>
				<div className={styles.list__item}>
					<a href={`/player/${userId}`}>
						<img src={logo} alt="logo" className={styles.logo} />{' '}
					</a>
				</div>
				<div className={styles.list__item}>
					<a href={`/player/${userId}`}>
						<p>Profile</p>
					</a>
				</div>
				<div className={styles.list__item}>
					<a href={`/player/${userId}/courses`}>
						<p>Cources</p>
					</a>
				</div>
				<div className={styles.list__account}>
					<label htmlFor="avatar" className={styles.list__account__label}>
						{userName}
					</label>
					<button
						type="button"
						className={styles.list__account__logout}
						onClick={() => {
							localStorage.removeItem('got');
							dispatch({
								type: 'LOGOUT',
							});
						}}
					>
						<img src={logout} alt="logout" />
					</button>
				</div>
			</div>
		</>
	);
}
