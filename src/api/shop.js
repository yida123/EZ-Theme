import request from './request';

// Xboard 在库存为 0 时 capacity_limit 返回 "Sold out"（已翻译）字符串，统一转换为 0
const normalizePlan = (plan) => {
  if (plan && typeof plan.capacity_limit === 'string') {
    const limit = Number(plan.capacity_limit);
    plan.capacity_limit = Number.isNaN(limit) ? 0 : limit;
  }
  return plan;
};

const normalizePlanResponse = (response) => {
  if (response && Array.isArray(response.data)) {
    response.data.forEach(normalizePlan);
  } else if (response && response.data) {
    normalizePlan(response.data);
  }
  return response;
};


export function fetchPlans() {
  return request({
    url: '/user/plan/fetch',
    method: 'get'
  }).then(normalizePlanResponse);
}


export function getCommConfig() {
  return request({
    url: '/user/comm/config',
    method: 'get'
  });
}


export function fetchPlanById(id) {
  return request({
    url: `/user/plan/fetch?id=${id}`,
    method: 'get'
  }).then(normalizePlanResponse);
}


export function verifyCoupon(code, planId) {
  return request({
    url: '/user/coupon/check',
    method: 'post',
    data: {
      code: code,
      plan_id: planId
    }
  });
}


export function submitOrder(data) {
  return request({
    url: '/user/order/save',
    method: 'post',
    data
  });
}


export function getOrderDetail(tradeNo) {
  return request({
    url: `/user/order/detail?trade_no=${tradeNo}`,
    method: 'get'
  }).then(response => {
    if (response && response.data && response.data.plan) {
      normalizePlan(response.data.plan);
    }
    return response;
  });
}


export function getPaymentMethods() {
  return request({
    url: '/user/order/getPaymentMethod',
    method: 'get'
  });
}


export function checkOrderStatus(tradeNo) {
  return request({
    url: `/user/order/check?trade_no=${tradeNo}`,
    method: 'get'
  });
}


export function cancelOrder(tradeNo) {
  return request({
    url: '/user/order/cancel',
    method: 'post',
    data: {
      trade_no: tradeNo
    }
  });
}


export function checkoutOrder(tradeNo, methodId) {
  return request({
    url: '/user/order/checkout',
    method: 'post',
    data: {
      trade_no: tradeNo,
      method: methodId
    }
  });
}

