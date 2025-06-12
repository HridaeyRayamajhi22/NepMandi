import OrderModel from '../models/order.model.js';
import UserModel from '../models/user.model.js';

export async function getDashboardData(req, res) {
  try {
    // Existing KPIs
    const [totalOrders, totalUsers] = await Promise.all([
      OrderModel.estimatedDocumentCount(),
      UserModel.estimatedDocumentCount(),
    ]);

    // Sales trend (last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const salesTrend = await OrderModel.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt', timezone: '+05:45' } },
          revenue: { $sum: '$totalAmt' },
          orders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Top products
    const topProducts = await OrderModel.aggregate([
      { $unwind: '$product_details' },
      {
        $group: {
          _id: '$product_details.name',
          qty: { $sum: '$product_details.quantity' },
        },
      },
      { $sort: { qty: -1 } },
      { $limit: 5 },
    ]);

    // NEW: Order status breakdown
    const orderStatusBreakdown = await OrderModel.aggregate([
      {
        $group: {
          _id: '$delivery_status',
          count: { $sum: 1 },
        },
      },
    ]);

    // NEW: Average order value
    const avgOrderValueResult = await OrderModel.aggregate([
      {
        $group: {
          _id: null,
          avgOrderValue: { $avg: '$totalAmt' },
        },
      },
    ]);
    const avgOrderValue = avgOrderValueResult[0]?.avgOrderValue || 0;

    res.json({
      success: true,
      data: {
        totalOrders,
        totalUsers,
        salesTrend,
        topProducts,
        orderStatusBreakdown,
        avgOrderValue,
      },
    });
  } catch (err) {
    console.error('Analytics error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch analytics' });
  }
}
