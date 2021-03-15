import React, { useEffect, useState } from 'react';
import { ModuleContextProvider, useModuleLoader } from './ModuleContext';

const Module = (props) => {
	const moduleLoader = useModuleLoader()

  let [ready, setReady] = useState(false);

	useEffect(() => {
		if (moduleLoader !== null && props.name) {
      if (moduleLoader.isModuleLoaded(props.name)) {
        setReady(true);
      } else {
	      moduleLoader.loadModule(props.name).then(() => {
	        moduleLoader.setModuleMountState(props.name, true)
          setReady(true);
	      });
	    }
    }
  	return () => {
  		if (moduleLoader !== null && props.name) {
  			moduleLoader.setModuleMountState(props.name, false)
  		}
  	};
	}, [props.name]);


  if (!moduleLoader || !ready) {
  	return <React.Fragment />
  }

  //console.log('module', props.name, 'now ready lets render')
  const loadedModule = moduleLoader.getLoadedModule(props.name)

  if (loadedModule) {
    const ModuleComponent = loadedModule.root
    return ModuleComponent
      ? (
          <ModuleContextProvider moduleLoader={moduleLoader}>
            <ModuleComponent {...props.options} />
          </ModuleContextProvider>
        )
      : <div>{`Module [${props.name}] is missing root view ...`}</div>
  } else {
    return (
      <div>
        {`Module [${props.name}] load failed ...`}
      </div>
    )
  }
}

export default Module;
//export default React.memo(Module, (props, nextProps) => !nextProps.frozen);
