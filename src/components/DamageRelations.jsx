import React, { useEffect } from 'react'

const DamageRelations = ({ damages }) => {
	const sprit = (damages) => {
		const from = filterDamageRelations('_from', damages)
		const to = filterDamageRelations('_to', damages)
		return { from, to }
	}

	const filterDamageRelations = (valueFilter, damages) => {
		const result = Object.entries(damages)
			.filter(([keyName, value]) => {
				return keyName.includes(valueFilter)
			})
			.reduce((acc, [keyName, value]) => {
				const keyWithValueFilterRemove = keyName.replace(
					valueFilter,
					'',
				)
				return (acc = { [keyWithValueFilterRemove]: value, ...acc })
			}, {})
		return result
	}
	useEffect(() => {
		const ArrayDamage = damages.map((damage) => {
			sprit(damage)
		})
	}, [damages])

	return <div>{ArrayDamage}</div>
}

export default DamageRelations
