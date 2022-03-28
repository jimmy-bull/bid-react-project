 // if (attrState[name] === undefined) {
        //     setattrState(prev => {
        //         return { ...prev, [name]: value }
        //     })
        // } else {
        //     if (typeof attrState[name] === 'string' && attrState[name].indexOf(value.toString()) === -1) {
        //         setattrState(prev => {
        //             return { ...prev, [name]: [...[attrState[name]], value.toString()] }
        //         })
        //     } else if (typeof attrState[name] === 'object' && attrState[name].indexOf(value.toString()) === -1) {
        //         setattrState(prev => {
        //             return { ...prev, [name]: [...attrState[name], value.toString()] }
        //         })
        //     }

        //     if (attrState[name].indexOf(value.toString()) > -1) {
        //         var Index = attrState[name].indexOf(value.toString());
        //         attrState[name].splice(Index, 1);

        //         setattrState(prev => {
        //             return { ...prev, [name]: attrState[name] }
        //         })
        //     }
        // }