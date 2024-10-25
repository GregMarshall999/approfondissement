import { onMounted, onUnmounted, ref } from "vue"

export function useMouse(element) {
    const x = ref(0);
    const y = ref(0);

    function update(event) {
        x.value = event.pageX;
        y.value = event.pageY;
    }

    onMounted(() => {
        console.log('comp mounted')
        element.value.addEventListener('mousemove', update) 
    });
    onUnmounted(() => element.value.removeEventListener('mousemove', update));

    return { x, y }
}