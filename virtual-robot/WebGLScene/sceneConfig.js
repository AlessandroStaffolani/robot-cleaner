const config = {
    floor: {
        size: {x: 25, y: 20}
    },
    player: {
        //position: { x: 0.5, y: 0.5 },		//CENTER
        position: {x: 0.10, y: 0.3},		//INIT
        //position: { x: 0.8, y: 0.85 },		//END
        speed: 0.2
    },
    sonars: [
        {
            name: "sonar1",
            position: {x: 0.06, y: 0.09},
            senseAxis: {x: true, y: true}
        },
        {
            name: "sonar2",
            position: {x: 0.94, y: 0.88},
            senseAxis: {x: true, y: true}
        }
    ],
    movingObstacles: [
        /* {
            name: "moving-obstacle-1",
            position: {x: .5, y: .5},
            directionAxis: {x: true, y: false},
            speed: 1,
            range: 8
        }, */
        /* {
            name: "moving-obstacle-2",
            position: {x: .4, y: .6},
            directionAxis: {x: true, y: true},
            speed: 1,
            range: 5
        } */
    ],
    staticObstacles: [
        {
            name: "divider",
            centerPosition: {x: 0.5, y: 0.35},
            size: {x: 0.98, y: 0.01}
        },
        /* {
            name: "table",
            centerPosition: {x: 0.4, y: 0.4},
            size: {x: 0.2, y: 0.2}
        }, */
        {
            name: "wallUp",
            centerPosition: {x: 0.5, y: 0.98},
            size: {x: 1, y: 0.0}
        },
        {
            name: "wallDown",
            centerPosition: {x: 0.5, y: 0.01},
            size: {x: 1, y: 0.01}
        },
        {
            name: "wallRight",
            centerPosition: {x: 1, y: 0.5},
            size: {x: 0.01, y: 0.98}
        },
        {
            name: "wallLeft",
            centerPosition: {x: 0, y: 0.5},
            size: {x: 0.01, y: 0.98}
        }
    ]
}

export default config;
