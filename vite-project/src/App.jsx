import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
 
function CourseCard(props){
    return(
    <section className='courseCard' id={props.courseName}>
        <div className='courseCardImageDiv'>
            <img src='/java.png' alt='zdjeciekursu' className='courseCardImage'></img>
        </div>
        <div className='courseInformations'>
            <h2 className='courseCardTitle'>Java Spring Framework, Spring Boot, Spring AI - Gen AI</h2>
            <p className='courseCardDescription'>Master Java, Spring and Spring Boot, Spring Security, Spring AI, Docker and Microservices with Telusko</p>
        </div>
        <div className='courseInformations2'>
            <span className='couseCardPrice'>39,99</span>
            <button type='button' className='courseCardAddCartButton'>Dodaj do koszyka</button>
        </div>
    </section>
    )
}
 
function App() {
    return(
        <>
            <CourseCard/>
            <CourseCard/>
            <CourseCard/>
            <CourseCard/>
            <CourseCard/>
            <CourseCard/>
            <CourseCard/>
            <CourseCard/>
            <CourseCard/>


        </>

    )
}
 
export default App