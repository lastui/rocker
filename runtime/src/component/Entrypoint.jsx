import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useModuleLoader, actions, Module } from "@lastui/rocker/platform";
import { getEntrypoint } from "../selector";

const Entrypoint = (props) => {
	const dispatch = useDispatch();
	useEffect(() => {
		dispatch(actions.init(props.fetchContext));
	}, []);
	const entrypoint = useSelector(getEntrypoint);
	return <Module name={entrypoint} />;
};

export default Entrypoint;
