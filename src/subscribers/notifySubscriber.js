module.exports = (data) => {
	console.log(`Notify subscriber triggered: A new resource was created!`);
	console.log(`Notification details:`, data);
	console.log(`Notification sent for resource: ${data.name}`);
};
