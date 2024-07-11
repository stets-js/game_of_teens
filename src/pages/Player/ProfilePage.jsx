import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import styles from './PlayerPage.module.scss';
import PlayerHeader from '../../components/PlayerHeader/PlayerHeader';
import WarningSVG from './WarningSVG';

export default function PlayerPage() {
    const userName = useSelector(state => state.auth.user.name);
    const { userId } = useParams();
    const [userData, setUserData] = useState({
        name: '',
        email: ''
    });

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await axios.get(`/api/users/${userId}`);
                if (response.data.status === 'success') {
                    setUserData({
                        name: response.data.data.data.name,
                        email: response.data.data.data.email
                    });
                }
            } catch (error) {
                console.error('Error fetching user data', error);
            }
        }
        fetchData();
    }, [userId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.patch(`/api/users/${userId}`, {
                name: userData.name,
                email: userData.email
            });
            alert('Дані успішно оновлено');
        } catch (error) {
            console.error('Error updating user data', error);
            alert('Не вдалося оновити дані');
        }
    };

    return (
        <>
            <PlayerHeader />
            <section className={styles.profile__wrapper}>
                <h2 className={styles.profile__title}>Привіт, {userName}!</h2>
                <div className={styles.profile__tip}>
                    <WarningSVG />
                    <p>Зверни увагу на персональні дані, якщо вказане тільки ім'я або псевдонім - зміни на прізвище та ім'я.</p>
                </div>
                <form className={styles.profile__data} onSubmit={handleSubmit}>
                    <label>
                        <p>Прізвище ім'я</p>
                        <input
                            type="text"
                            name="name"
                            value={userData.name}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <label>
                        <p>E-mail</p>
                        <input
                            type="email"
                            name="email"
                            value={userData.email}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <button className={styles.profile__formBtn} type="submit">Зберегти</button>
                </form>
            </section>
        </>
    );
}
