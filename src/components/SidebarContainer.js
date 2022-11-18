// using React from the compiling
import React, { useState, useEffect, useRef } from "react"
import axios from "axios"
import { useDrag } from "@use-gesture/react"
import { animated, config, useSpring } from "@react-spring/web"

import { Container, NowPlayingDrawer, Flex, CardHeader, CardHeading, CardBody, Input, Card, Content, ActionBtn, Handle, Sheet, HandleWrapper } from "./Elements"
import { projection, findNearestNumberInArray } from "./Utilies"

const dummyData = [
    { id: 0, busNumber: "HP06B4344", departure: "10:00 AM", arrival: "5:00 PM" },
    { id: 1, busNumber: "HP06B4364", departure: "09:00 AM", arrival: "5:30 PM" },
    { id: 2, busNumber: "HP06B4334", departure: "07:00 AM", arrival: "5:40 PM" },
    { id: 0, busNumber: "HP06B4344", departure: "10:00 AM", arrival: "5:00 PM" },
    { id: 1, busNumber: "HP06B4364", departure: "09:00 AM", arrival: "5:30 PM" },
    { id: 2, busNumber: "HP06B4334", departure: "07:00 AM", arrival: "5:40 PM" },
    { id: 0, busNumber: "HP06B4344", departure: "10:00 AM", arrival: "5:00 PM" },
    { id: 1, busNumber: "HP06B4364", departure: "09:00 AM", arrival: "5:30 PM" },
    { id: 2, busNumber: "HP06B4334", departure: "07:00 AM", arrival: "5:40 PM" }
]

const SidebarContainer = () => {
    const [data, setData] = useState(dummyData)

    // is it is mobile
    const isMobile = window.matchMedia("(max-width:550px)").matches

    let lastOffsetX = 0
    let lastOffsetY = 0

    const [{ x, y }, api] = useSpring(() => ({
        x: 0,
        y: 0
    }))

    const height = window.innerHeight

    const open = () => {
        console.log("open")
        api.start({
            y: 0,
            immediate: false,
            config: config.slow
        })
    }

    const close = () => {
        console.log("close", height * 0.8)
        let newHeight = height * 0.9
        // let newHeight = height * 0.8 - (55 - height * 0.01)
        console.log("new height :", newHeight)
        api.start({
            y: newHeight,
            immediate: false,
            config: config.slow
        })
    }

    console.log("isMobile ", isMobile)

    // const bind = useDrag(({ offset: [ox, oy] }) => api.start({ x: ox, jy: oy }))

    const bind = useDrag(({
        movement: [mx, my],
        velocity: [, vy],
        direction: [, dy],
        offset: [ox, oy],
        last,
        memo,
        cancel,
        canceled,
        event
    }) => {
        // event.preventDefault();

        // console.log("before x and y", lastOffsetX, lastOffsetY)

        // if (ox > lastOffsetX || oy > lastOffsetY) {
        // 	lastOffsetX = ox
        // 	lastOffsetY = oy
        // }

        console.log("values", mx, my, ox, oy, last, y.get())

        // console.log("after change x and y", lastOffsetX, lastOffsetY)
        if (my < -1) cancel()

        if (last) {
            my > height * 0.5 || (vy > 0.5 && dy > 0) ? close() : open()
            return
        }


        console.log("Y get ", y.get())

        api.start({ y: my, immediate: true })

        // api.start({ x: ox, y: oy })
    }, {
        form: () => isMobile ? [0, y.get()] : null,
        filterTaps: true,
        //from: [isMobile ? 0 : x.get()],
        bounds: { top: 0, left: 0, right: isMobile ? 0 : Infinity, }
    })

    const display = y.to((py) => console.log(py))

    return (
        <Flex>
            <ActionBtn></ActionBtn>
            <Sheet
                as={animated.div}
                {...bind()}
                style={{ x, y }}
            >
                <HandleWrapper>
                    <Handle></Handle>
                </HandleWrapper>
                <Input type="search" placeholder="search"></Input>
                <Content>
                    {data.map(item => {
                        return (
                            <Card>
                                <CardHeader>
                                    <CardHeading>{item.busNumber}</CardHeading>
                                    <div>
                                        <div>{item.departure}</div>
                                        <div>-</div>
                                        <div>{item.arrival}</div>
                                    </div>
                                </CardHeader>
                                <CardBody>
                                    <div>{item.departure}</div>
                                    <div>|</div>
                                    <div>{item.arrival}</div>
                                </CardBody>
                            </Card>
                        )
                    })}
                </Content>
            </Sheet>
        </Flex>
    )
}

export default SidebarContainer