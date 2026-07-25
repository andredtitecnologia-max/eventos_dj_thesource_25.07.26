import { services as defaultServices } from '../data/services';
const STORAGE_KEY = 'djTheSourceServices';
function getLocalServices() {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : defaultServices;
}
function saveLocalServices(services) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(services));
}
export async function fetchServices() {
    try {
        const response = await fetch('/api/services');
        if (!response.ok)
            throw new Error('Falha ao buscar serviços');
        return response.json();
    }
    catch {
        return getLocalServices();
    }
}
export async function fetchServiceById(id) {
    try {
        const response = await fetch(`/api/services/${id}`);
        if (!response.ok)
            throw new Error('Serviço não encontrado');
        return response.json();
    }
    catch {
        const services = getLocalServices();
        const service = services.find(item => item.id === id);
        if (!service)
            throw new Error('Serviço não encontrado');
        return service;
    }
}
export async function updateService(service) {
    const services = getLocalServices();
    const updated = services.map(item => item.id === service.id ? { ...item, ...service } : item);
    saveLocalServices(updated);
    return updated.find(item => item.id === service.id);
}
export async function addService(service) {
    const services = getLocalServices();
    const newService = {
        id: `${service.title.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
        editable: true,
        ...service,
    };
    const nextServices = [...services, newService];
    saveLocalServices(nextServices);
    return newService;
}
