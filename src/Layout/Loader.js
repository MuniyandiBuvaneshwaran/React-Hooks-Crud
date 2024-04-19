import React from 'react'
import { ThreeCircles } from 'react-loader-spinner'
export default function Loader() {
    return (
        <div>
            <div className='spinner-wrapper'>
                <ThreeCircles
                    height="100"
                    width="100"
                    color="pink"
                    wrapperStyle={{}}
                    wrapperClass=""
                    visible={true}
                    ariaLabel="three-circles-rotating"
                    outerCircleColor=""
                    innerCircleColor=""
                    middleCircleColor=""
                />
            </div>
        </div>
    )
}
