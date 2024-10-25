<template>
    <div class="lister" id="notEdit" @click="disableEdit">
        <h2>Tableau de produits</h2>

        <ListerComp 
            :entity-list="'product'"
            :is-admin="true"
            @entity-selected="selectProduct"
        >
            <ProductComp 
                v-if="!newProductMode"
                @selected="newProductMode = true"
                :slot-count="2"
                v-show="!editProductMode"
            >
                <template #['field1']>
                    <span class="name">Nouveau Produit</span>
                </template>
                <template #['field2']>
                    <span class="price">+</span>
                </template>
            </ProductComp>
            <li v-else>
                <FormComp
                    :fields="formFields"
                    :submitButtonText="'Ajouter'"
                    @success="newProduct"
                />
                <button style="margin-top: 1em;" @click="newProductMode = false">Annuler</button>
            </li>
        </ListerComp>

        <div class="admin-tools" ref="adminMouse">
            <div class="admin-controls">
                <h3>Contrôlles Admin</h3>

                <label class="sales-toggle">
                    Activer les soldes
                    <input 
                        type="checkbox"
                        v-model="sales"
                        @change="updateSales"
                    />
                    <span class="checkmark"></span>
                </label>

                <button @click="augmentPrice(4)">Augmenter Prix</button>
                <button @click="reduicePrice(1)">Réduire Prix</button>
            </div>

            <div class="product-editor" v-show="!newProductMode">
                <h3 style="margin-bottom: 1em;">Editer un Produit</h3>

                <FormComp
                    :fields="formFields"
                    :submitButtonText="'Editer'"
                    @success="updateProduct"
                />
                <button @click="deleteProduct">Supprimer</button>
            </div>

            <p>x:{{ x }} | y:{{ y }}</p>
        </div>
    </div>
</template>

<script setup>
import FormComp from '@/components/form/FormComp.vue';
import ListerComp from '@/components/ListerComp.vue';
import ProductComp from '@/components/products/ProductComp.vue';
import { useMouse } from '@/composables/mouse';
import { requiredDefined, requiredPositiveNumber, requiredText } from '@/helper/ValidationHelper';
import { onMounted, reactive, ref } from 'vue';
import { useStore } from 'vuex';

const store = useStore();

const augmentPrice = amount => {
    store.dispatch('product/augmentPrice', amount);
}
const reduicePrice = amount => {
    store.dispatch('product/reduicePrice', amount);
}

const sales = ref(false);
const updateSales = () => {
    store.dispatch('product/updateSales', sales.value);
}

const selectedProduct = reactive({
    id: null,
    name: '', 
    price: null
})
const selectedIndex = ref(null);
const selectProduct = index => {
    if(!newProductMode.value) {
        editProductMode.value = true;

        selectedIndex.value = index;
        const storeProd = store.getters['product/getProduct'](index);

        selectedProduct.id = storeProd.id;
        formFields[0].value = storeProd.name;
        formFields[1].value = storeProd.price;
    }
}
const updateProduct = result => {
    if(selectedIndex.value != null) {
        store.dispatch('product/updateProduct', 
            {
                id: selectedProduct.id, 
                name: result[0], 
                price: result[1]
            }
        );

        formFields.forEach(field => field.value = null);
        editProductMode.value = false;
        selectedIndex.value = null;
        selectedProduct.id = null;
    }
}
const deleteProduct = () => {
    if(selectedIndex.value) {
        store.dispatch('product/removeProduct', selectedProduct.id);
        selectedIndex.value = null
        selectedProduct.id = null;
        formFields.forEach(field => field.value = null);
        editProductMode.value = false;
    }
}

const newProductMode = ref(false);
const editProductMode = ref(false);
const newProduct = result => {
    const product = {};
    const keys = [ 'name', 'price' ];

    for(var i = 0; i < result.length; i++) {
        product[keys[i]] = result[i];
    }

    store.dispatch('product/addProduct', product);

    formFields.forEach(field => field.value = null);
    newProductMode.value = false;
}

const formFields = reactive([
    {
        placeholder: 'Nom Produit...', 
        type: 'text', 
        value: null, 
        rules: [requiredDefined, requiredText]
    }, 
    {
        placeholder: 'Prix Produit...', 
        type: 'number', 
        value: null, 
        rules: [requiredDefined, requiredPositiveNumber]
    }
]);

const disableEdit = e => {
    if(e.target.id == 'notEdit') {
        editProductMode.value = false;
        formFields.forEach(field => field.value = null);
    }
}

onMounted(() => console.log('parent mounted'));
const adminMouse = ref(null);
const { x, y } = useMouse(adminMouse);
</script>

<style lang="scss">
@import '@/scss/GlobalStyle.scss';

.lister {
    background: #6b662a;
    box-shadow: 1px 2px 3px rgba(0,0,0,0.2);
    margin-bottom: 30px;
    padding: 10px 20px;
    color: black;

    .admin-tools {
        background: rgba(255, 255, 255, 0.432);
        margin-top: 1em;
        padding: 20px;
        display: flex;
        gap: 10%;

        .admin-controls {
            display: flex;
            flex-direction: column;
            gap: 1em;
            border-right: solid 2px rgb(105, 105, 105);
            padding-right: 10%;

            .sales-toggle {
                display: block;
                position: relative;
                padding-left: 35px;
                margin-bottom: 12px;
                cursor: pointer;
                font-size: 16px;

                input {
                    position: absolute;
                    opacity: 0;
                    cursor: pointer;
                    height: 0;
                    width: 0;
                }

                .checkmark {
                    position: absolute;
                    top: 0;
                    left: 0;
                    height: 25px;
                    width: 25px;
                    background-color: #eee;
                }

                .checkmark:after {
                    content: "";
                    position: absolute;
                    display: none;
                    left: 9px;
                    top: 5px;
                    width: 5px;
                    height: 10px;
                    border: solid white;
                    border-width: 0 3px 3px 0;
                    transform: rotate(45deg);
                }
            }
            .sales-toggle:hover input ~ .checkmark {
                background-color: #ccc;
            }
            .sales-toggle input:checked ~ .checkmark {
                background-color: #6b662a;
            }
            .sales-toggle input:checked ~ .checkmark:after {
                display: block;
            }
        }

        .product-editor {
            form {
                display: flex;
                flex-direction: column;
                gap: 1em;
                margin-bottom: 1em;
                
                input {
                    border: none;
                    font-size: 16px;
                }
            }
        }
        
        
    }
}

button {
    @include button;
}

</style>