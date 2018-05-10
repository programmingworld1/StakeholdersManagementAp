class Data_converter
{
	get_data(_data)
	{
		var stakeholderArray = [];

		for (let cat = 0; cat < _data.length; cat++)
		{
			var stakeholder_category = _data[cat].stakeholder_category;
			
			for (let sth = 0; sth < stakeholder_category.length; sth++)
			{
				var stakeholders = [];
				var category = {category:stakeholder_category[sth].label, stakeholders:stakeholders};

				var stakeholderExist = false;

				for (let arr = 0; arr < stakeholderArray.length; arr++)
				{
					if(stakeholder_category[sth].label == stakeholderArray[arr].category)
					{
						stakeholderArray[arr].stakeholders.push(_data[cat]);
						stakeholderExist = true;
						break;
					}
				}
				if (stakeholderExist === false)
				{
					category.stakeholders.push(_data[cat]);
					stakeholderArray.push(category);
				}
			}
		}
		
		return stakeholderArray;
	}
}

if ( typeof module !== 'undefined' && module.hasOwnProperty('exports') )
	module.exports = Data_converter;